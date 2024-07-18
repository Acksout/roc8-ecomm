import {connectDb} from "@/lib/db";
import {NextResponse} from "next/server";
import Jwt from "jsonwebtoken";

const authenticate = async (req) => {
    const cookie = req.cookies.get("session");
    if (!cookie) {
        return NextResponse.json(
            {message: "unauthorised request"},
            {status: 403}
        );
    }

    try {
        const token = Jwt.verify(cookie.value, process.env.REFRESH_TOKEN_SECRET);
        if (!token) {
            return NextResponse.json(
                {message: "cookie is expired"},
                {status: 401}
            );
        }
        return token;
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "invalid token"}, {status: 401});
    }
};

export async function GET(req) {
    try {
        const token = await authenticate(req);
        const client = await connectDb.connect();
        const getUsersCategory = await client.query(
            "SELECT * FROM userscategory where userId = ($1)",
            [token.id]
        );
        const getCategory = await client.query("SELECT * FROM category");

        if (getCategory.rowCount === 0) {
            return NextResponse.json(
                {message: "no category found"},
                {status: 401}
            );
        }

        return NextResponse.json(
            {
                message: "all category fetched successfully",
                data: getCategory.rows,
                userData: getUsersCategory.rows,
            },
            {status: 200}
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "user creation failed"},
            {status: 400}
        );
    }
}

export async function POST(req) {
    try {
        const token = await authenticate(req);
        const {productId} = await req.json();

        if (!productId) {
            return NextResponse.json(
                {message: "All fields are required"},
                {status: 401}
            );
        }

        const client = await connectDb.connect();
        const check = await client.query(
            "SELECT * FROM userscategory where userId = ($1) and categoryId = ($2)",
            [token.id, productId]
        );

        if (check.rowCount === 0) {
            await client.query(
                "INSERT INTO userscategory (userId, categoryId) VALUES($1, $2)",
                [token.id, productId]
            );
            return NextResponse.json(
                {message: "category added to save list"},
                {status: 200}
            );
        } else {
            await client.query("DELETE FROM userscategory WHERE id = ($1)", [
                check.rows[0].id,
            ]);
            return NextResponse.json(
                {message: "category removed from list"},
                {status: 200}
            );
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: error.message}, {status: 400});
    }
}
