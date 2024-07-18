"use client";

import Link from "next/link";

function Header() {
    return (
        <div className="flex w-full max-md:max-w-full flex-col bg-white pb-4">
            <div
                className="flex w-full max-md:max-w-full flex-col items-end justify-center bg-white max-md:px-5 px-16 pt-1 text-xs text-zinc-800">
                <div className="flex justify-end gap-5 pl-3.5">
                    <div className="justify-center whitespace-nowrap py-0.5">
                        Help
                    </div>
                    <div className="justify-center py-0.5">Orders & Returns</div>
                    <div className="justify-center text-right p-0.5">Hi, John</div>
                </div>
            </div>

            <div
                className="mt-2 flex w-full max-md:max-w-full max-md:flex-wrap items-center justify-between gap-5 self-center px-5 max-w-[1360px]">
                <Link href={"/"}>
                    <div className="text-3xl font-bold text-black">ECOMMERCE</div>
                </Link>
                <div className="flex max-md:flex-wrap gap-5 pr-20 text-base font-semibold text-black">
                    <div className="grow">Categories</div>
                    <div>Sales</div>
                    <div>Clearance</div>
                    <div>New stock</div>
                    <div>Trending</div>
                </div>
                <div className="flex justify-between gap-5">
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/60ae73f8a76ed0e41cd9f289463ef507bcd8f984a5f9ffd01e9da6d417283fee?apiKey=138a9a05636f4818b7903db304a97a25&"
                        className="aspect-square w-8 shrink-0"
                    />
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/7b5a1d1ea050cd8214a3c6b75f35155739321540846412f1523e93187ba89f96?apiKey=138a9a05636f4818b7903db304a97a25&"
                        className="aspect-square w-8 shrink-0"
                    />
                </div>
            </div>
        </div>
    );
}

export default Header;
