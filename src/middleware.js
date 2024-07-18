import {NextResponse} from "next/server";
import * as jose from 'jose';

const jwtConfig = {
    secret: new TextEncoder().encode(process.env.EMAIL_VERIFICATION_SECRET),
    secret2: new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET),
};

export async function middleware(request) {
    const {pathname} = request.nextUrl;

    if (pathname.startsWith("/verify")) {
        return verifyCookie(request, jwtConfig.secret, "/login", "email");
    }

    if (pathname.startsWith("/dashboard")) {
        return verifyCookie(request, jwtConfig.secret2, "/login", null);
    }

    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        return redirectIfAuthenticated(request, jwtConfig.secret2, "/dashboard");
    }

    return NextResponse.next();
}

async function verifyCookie(request, secret, redirectUrl, param) {
    const cookie = request.cookies.get(param ? "verify" : "session");

    if (!cookie) {
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    try {
        const check = await jose.jwtVerify(cookie.value, secret);

        if (!check) {
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }

        if (param) {
            const url = new URL("/verify", request.url);
            url.searchParams.set(param, check.payload?.[param]);
            return NextResponse.rewrite(url);
        }

        return NextResponse.next();
    } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
}

async function redirectIfAuthenticated(request, secret, redirectUrl) {
    const cookie = request.cookies.get("session");

    if (cookie) {
        try {
            const check = await jose.jwtVerify(cookie.value, secret);

            if (check) {
                return NextResponse.redirect(new URL(redirectUrl, request.url));
            }
        } catch (error) {
            console.log(error);
        }
    }

    return NextResponse.next();
}
