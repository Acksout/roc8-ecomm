"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import Loading from "@/components/Loading";

function LoginUser() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/login", {
                method: "post",
                body: JSON.stringify(data),
            });
            const r = await res.json();

            if (res.status < 400) {
                router.replace("/dashboard");
                setData({
                    name: "",
                    email: "",
                    password: "",
                });
            } else {
                setError(r.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-10 flex max-w-full flex-col self-center rounded-3xl border border-solid border-stone-300 bg-white max-md:px-5 px-16 py-12 text-base text-black w-[576px]"
        >
            <div className="self-center text-3xl font-semibold text-black">Login</div>
            <div className="max-md:mt-10 mt-11 mr-6 self-center text-2xl font-medium text-black max-md:mr-2.5">
                Welcome back to ECOMMERCE
            </div>
            <div className="mt-6 self-center text-black">
                The next gen business marketplace
            </div>

            {error && (
                <div className="mt-3 w-full text-center text-red-500">{error}</div>
            )}
            {loading ? <Loading/> : ""}
            <div className="mt-9 max-md:max-w-full text-black">Email</div>
            <input
                value={data.email}
                placeholder="Enter"
                onChange={(e) => setData({...data, email: e.target.value})}
                name="email"
                className="mt-3 flex max-md:max-w-full max-md:flex-wrap gap-5 whitespace-nowrap rounded-md border border-solid border-stone-300 bg-white px-4 py-4"
            />

            <div className="mt-9 max-md:max-w-full text-black">Password</div>
            <input
                type="password"
                placeholder="Enter"
                value={data.password}
                onChange={(e) => setData({...data, password: e.target.value})}
                name="password"
                className="mt-3 flex max-md:max-w-full max-md:flex-wrap gap-5 whitespace-nowrap rounded-md border border-solid border-stone-300 bg-white px-4 py-4"
            />

            <button
                className="mt-10 max-md:max-w-full items-center justify-center whitespace-nowrap rounded-md border border-solid border-black bg-black max-md:px-5 px-16 py-5 text-center font-medium uppercase tracking-wider text-white">
                Login
            </button>
            <div className="mt-7 h-px max-md:max-w-full shrink-0 bg-stone-300"/>
            <div className="mt-9 flex self-center gap-3.5">
                <div className="grow text-zinc-800">Don’t have an Account?</div>
                <div className="font-medium uppercase tracking-wider text-black">
                    <Link href={"/register"}>Sign up</Link>
                </div>
            </div>
        </form>
    );
}

export default LoginUser;
