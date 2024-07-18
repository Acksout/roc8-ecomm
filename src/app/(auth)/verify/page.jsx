"use client";
import React, {useState, useRef, useEffect} from "react";
import {v4 as uuid} from "uuid";
import {useRouter} from "next/navigation";
import Loading from "@/components/Loading";
import jwt from "jsonwebtoken";

function VerifyUser() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [inputs, setInputs] = useState(new Array(8).fill(""));
    const [missing, setMissing] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef(new Array(8));

    useEffect(() => {
        const verifyCookie = document.cookie.split('; ').find(row => row.startsWith('verify='));
        if (verifyCookie) {
            const token = verifyCookie.split('=')[1];
            try {
                const decoded = jwt.decode(token);
                if (decoded && decoded.email) {
                    setEmail(decoded.email);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        inputRefs.current[0].focus();
    }, []);

    const handleSubmit = async () => {
        setError("");
        const missed = inputs.filter((item) => item === "");

        if (missed.length) {
            setMissing(missed.map((_, i) => i));
            return;
        }

        setLoading(true);
        const code = inputs.join("");
        const response = await fetch("/api/verify", {
            method: "post",
            body: JSON.stringify({code}),
        });
        const r = await response.json();

        if (response.status < 400) {
            router.replace("/dashboard");
        } else {
            setError(r.message);
        }
        setLoading(false);
    };

    const handleInputChange = (e, index) => {
        const val = e.target.value;

        if (!/^\d*$/.test(val)) return;

        setInputs((prev) => {
            const newInputs = [...prev];
            newInputs[index] = val;
            return newInputs;
        });

        if (index < inputs.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleOnKeyDown = (e, index) => {
        if (e.keyCode === 8) {
            setInputs((prev) => {
                prev[index] = "";
                return [...prev];
            });
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData("text");
        if (!data || !/^\d+$/.test(data)) return;

        const pasteCode = data.slice(0, 8).split("");
        const newInputs = [...inputs];

        pasteCode.forEach((digit, index) => {
            if (index < inputs.length) {
                newInputs[index] = digit;
            }
        });

        setInputs(newInputs);

        const lastFilledIndex = newInputs.findLastIndex(input => input !== "");
        const focusIndex = lastFilledIndex < inputs.length - 1 ? lastFilledIndex + 1 : lastFilledIndex;
        inputRefs.current[focusIndex].focus();
    };

    return (
        <div
            className="mt-10 flex max-w-full flex-col self-center rounded-3xl border border-solid border-stone-300 bg-white max-md:px-5 px-16 py-14 w-[576px]">
            <div className="self-center text-3xl font-semibold text-black">
                Verify your email
            </div>
            <div className="mt-9 self-center text-center text-base text-black">
                Enter the 8 digit code you have received on <br/>
                <span className="font-medium">{email || "your email"}</span>
            </div>
            <div className="flex w-full items-center justify-center">
                {loading ? <Loading/> : ""}
            </div>
            <span className="mt-3 w-full text-center text-red-500"> {error} </span>

            <div className="mt-3 flex max-md:flex-wrap gap-3 text-black px-0.5">
                {inputs.map((item, i) => (
                    <input
                        key={uuid()}
                        ref={(el) => (inputRefs.current[i] = el)}
                        type="text"
                        maxLength="1"
                        value={item}
                        onPaste={handlePaste}
                        onChange={(e) => handleInputChange(e, i)}
                        onKeyDown={(e) => handleOnKeyDown(e, i)}
                        className={`shrink-0 bg-white rounded-md border-2 border-solid  focus:outline-lime-600 h-[47px] w-[47px] cursor-auto text-center ${
                            missing.includes(i) ? "border-red-500" : "border-stone-300"
                        }`}
                    />
                ))}
            </div>
            <div
                onClick={handleSubmit}
                className="max-md:mt-10 mt-16 max-md:max-w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-solid border-black bg-black max-md:px-5 px-16 py-5 text-center text-base font-medium uppercase tracking-wider text-white"
            >
                Verify
            </div>
        </div>
    );
}

export default VerifyUser;