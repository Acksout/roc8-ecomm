"use client";
import Loading from "@/components/Loading";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";

function LogoutUser() {
    const router = useRouter();
    useEffect(() => {
        fetch("/api/logout")
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                router.replace("/");
            });
    });
    return (
        <div className="mt-10 h-20 w-full">
            <Loading></Loading>
        </div>
    );
}

export default LogoutUser;
