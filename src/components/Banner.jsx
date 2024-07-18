'use client'

function Banner() {
    return (
        <div
            className="flex w-full max-md:max-w-full items-center justify-center bg-zinc-100 max-md:px-5 px-16 text-sm font-medium text-black py-2.5">
            <div className="flex items-start gap-5">
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/0d0e43c6157dac81b4659d4a258ab52a17e6f73251e43b1bd0dd27e644dbdd6e?apiKey=138a9a05636f4818b7903db304a97a25&"
                    className="aspect-square w-4 shrink-0"
                />
                <div className="flex-auto self-stretch">
                    Get 10% off on business sign up
                </div>
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff3effd7635170030964f3361bea79472b59f0f6634371170e446c93b7552c9e?apiKey=138a9a05636f4818b7903db304a97a25&"
                    className="aspect-square w-4 shrink-0"
                />
            </div>
        </div>
    )
}

export default Banner
