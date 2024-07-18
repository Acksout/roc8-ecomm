"use client";
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Loading from "@/components/Loading";

function RegisterUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState({name: "", email: "", password: ""});
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/register", {
                method: "post",
                body: JSON.stringify(data),
            });
            const r = await res.json();

            if (res.status < 400) {
                await fetch("/api/verify");
                router.replace("/verify");
                setData({name: "", email: "", password: ""});
            } else {
                setError(r.message);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-10 flex max-w-full flex-col self-center rounded-3xl border border-solid border-stone-300 bg-white max-md:px-5 px-16 py-12 text-base text-black w-[576px]"
        >
            <div className="self-center text-3xl font-semibold text-black">
                Create Your Account
            </div>

            {error && (
                <span className="mt-3 w-full text-center text-red-500">{error}</span>
            )}
            {loading ? <Loading/> : ""}

            <div className="mt-9 max-md:max-w-full text-black">Name</div>
            <input
                value={data.name}
                placeholder="Enter"
                onChange={(e) => setData({...data, name: e.target.value})}
                name="name"
                className="mt-3 flex max-md:max-w-full max-md:flex-wrap gap-5 whitespace-nowrap rounded-md border border-solid border-stone-300 bg-white px-4 py-4"
            />

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
            <p>Use this pass if you&apos;re lazy FBKd0g*I2*4*$k1n</p>

            <button
                className="mt-10 max-md:max-w-full items-center justify-center whitespace-nowrap rounded-md border border-solid border-black bg-black max-md:px-5 px-16 py-5 text-center font-medium uppercase tracking-wider text-white">
                Create Account
            </button>

            <div className="mt-7 h-px max-md:max-w-full shrink-0 bg-stone-300"/>
            <div className="mt-9 flex self-center gap-3.5">
                <div className="grow text-zinc-800">Have an Account?</div>
                <div className="font-medium uppercase tracking-wider text-black">
                    <Link href={"/login"}>sign in</Link>
                </div>
            </div>
        </form>
    );
}

export default RegisterUser;
