import {connectDb} from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {cookies} from "next/headers";

const authenticateUser = async (req) => {
    const {email, password} = await req.json();

    if (!email || !password) {
        return NextResponse.json(
            {message: "All fields are required"},
            {status: 401}
        );
    }

    try {
        const client = await connectDb.connect();
        const user = await client.query("SELECT * FROM users WHERE email = ($1)", [
            email,
        ]);

        if (user.rowCount === 0) {
            return NextResponse.json(
                {message: "Email not registered"},
                {status: 401}
            );
        }

        const userData = user.rows[0];
        const isValidPassword = await bcrypt.compare(password, userData.password);

        if (!isValidPassword) {
            return NextResponse.json(
                {message: "Password incorrect"},
                {status: 401}
            );
        }

        const token = jwt.sign(
            {email: userData.email, id: userData.id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
        );
        cookies().set("session", token, {secure: true, httpOnly: true});

        return NextResponse.json(
            {message: "User logged in successfully"},
            {status: 200}
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "User login failed"}, {status: 400});
    }
};

export async function POST(req) {
    return authenticateUser(req);
}
