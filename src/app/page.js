import Link from "next/link";

export default function Home() {
    return (
        <div className="mt-10">
            <Link className="mx-3" href={"/"}>
                HomePage
            </Link>
            <Link className="mx-3" href={"/login"}>
                Login
            </Link>
            <Link className="mx-3" href={"/register"}>
                Register
            </Link>
            <Link className="mx-3" href={"/dashboard"}>
                Dashboard
            </Link>
            <Link className="mx-3" href={"/logout"}>
                Logout
            </Link>
        </div>
    );
}
