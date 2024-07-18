import {connectDb} from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";
import bcrypt from "bcrypt";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()_+])[A-Za-z\d@#$%^&*()_+]{8,}$/;

export async function POST(req) {
    try {
        const {name, email, password} = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                {message: "All fields are required"},
                {status: 401}
            );
        }

        if (!emailPattern.test(email)) {
            return NextResponse.json(
                {message: "Invalid email address"},
                {status: 401}
            );
        }

        if (!passwordPattern.test(password)) {
            return NextResponse.json(
                {
                    message:
                        "Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
                },
                {status: 401}
            );
        }

        const client = await connectDb.connect();
        if (!connectDb) {
            console.log('connectDb is undefined');
            // handle the error
        }


        const existingUser = await client.query(
            "SELECT * FROM users WHERE email = ($1)",
            [email]
        );

        if (existingUser.rowCount) {
            return NextResponse.json(
                {message: "Email is already registered"},
                {status: 401}
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await client.query(
            "INSERT INTO users(name, email, password) VALUES($1, $2, $3)",
            [name, email, hashedPassword]
        );

        const token = jwt.sign({email}, process.env.EMAIL_VERIFICATION_SECRET, {
            expiresIn: 60 * 15,
        });
        cookies().set("verify", token, {secure: true, httpOnly: true});

        return NextResponse.json(
            {message: "User created successfully"},
            {status: 201}
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "User creation failed"},
            {status: 400}
        );
    }
}
