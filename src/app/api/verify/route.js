import {NextResponse} from "next/server";
import Jwt from "jsonwebtoken";
import {connectDb} from "@/lib/db";
import {transporter} from "@/lib/email";
import {cookies} from "next/headers";

const verifyToken = (token, secret) => {
    try {
        return Jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

const generateOTP = () => {
    return Array(8)
        .fill(0)
        .map(() => Math.floor(Math.random() * 10))
        .join("");
};

export async function GET(request) {
    try {
        const cookie = request.cookies.get("verify");
        if (!cookie) {
            return NextResponse.json(
                {message: "Cookie is required"},
                {status: 401}
            );
        }

        const check = verifyToken(
            cookie.value,
            process.env.EMAIL_VERIFICATION_SECRET
        );
        if (!check) {
            return NextResponse.json(
                {message: "Cookie is expired"},
                {status: 401}
            );
        }

        const client = await connectDb.connect();
        const finduser = await client.query(
            "SELECT * FROM users WHERE email = $1",
            [check.email]
        );
        if (!finduser.rowCount) {
            return NextResponse.json(
                {message: "Token is invalid"},
                {status: 401}
            );
        }

        const otp = generateOTP();
        const hash = Jwt.sign({otp}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "15m",
        });

        await client.query("UPDATE users SET emailcode = $1 WHERE email = $2", [
            hash,
            check.email,
        ]);

        await transporter.sendMail({
            from: "ROC8ECOMM",
            to: finduser.rows[0].email,
            subject: "Verify Your Email",
            text: "Email verification mail from ROC8ECOMM",
            html: `<h1>${otp}</h1>`,
        });

        return NextResponse.json(
            {message: "Verification email is sent"},
            {status: 200}
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: error.message}, {status: 500});
    }
}

export async function POST(request) {
    try {
        const client = await connectDb.connect();
        const {code} = await request.json();

        if (!code) {
            return NextResponse.json(
                {message: "All fields are required"},
                {status: 401}
            );
        }

        const cookie = request.cookies.get("verify");
        if (!cookie) {
            return NextResponse.json(
                {message: "Cookie is required"},
                {status: 401}
            );
        }

        const token = verifyToken(
            cookie.value,
            process.env.EMAIL_VERIFICATION_SECRET
        );
        if (!token) {
            return NextResponse.json(
                {message: "Cookie is expired"},
                {status: 401}
            );
        }

        const check = await client.query("SELECT * FROM users WHERE email = $1", [
            token.email,
        ]);
        if (check.rowCount === 0) {
            return NextResponse.json(
                {message: "Email not registered"},
                {status: 401}
            );
        }

        const userData = check.rows[0];
        const pass = verifyToken(
            userData.emailcode,
            process.env.REFRESH_TOKEN_SECRET
        );

        if (!pass || pass.otp !== code) {
            return NextResponse.json(
                {message: "Invalid or expired code"},
                {status: 401}
            );
        }

        await client.query("UPDATE users SET emailverify = $1 WHERE email = $2", [
            true,
            userData.email,
        ]);

        const newToken = Jwt.sign(
            {email: userData.email, id: userData.id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
        );
        cookies().set("session", newToken, {secure: true, httpOnly: true});

        return NextResponse.json({message: "User verified"}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {message: "User verification failed"},
            {status: 400}
        );
    }
}
