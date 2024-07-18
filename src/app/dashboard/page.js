"use client";
import Loading from "@/components/Loading";
import React, {useState, useEffect} from "react";
import {v4 as uuid} from "uuid";

function Dashboard() {
    const [categories, setCategories] = useState([]);
    const [userCategories, setUserCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayCategories, setDisplayCategories] = useState([]);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const perPage = 6;

    useEffect(() => {
        fetch("/api/category")
            .then((res) => res.json())
            .then((data) => {
                const categoriesWithChecked = data.data.map((item) => {
                    return data.userData.find((i) => i.categoryid === item.id)
                        ? {...item, checked: true}
                        : {...item, checked: false};
                });

                setCategories(categoriesWithChecked);
                setUserCategories(data.userData);
                setDisplayCategories(categoriesWithChecked.slice(0, perPage));
                setPages(
                    [
                        ...Array(
                            Math.ceil(categoriesWithChecked.length / perPage) + 1
                        ).keys(),
                    ].slice(1)
                );
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    const handleInputChange = (id) => {
        fetch("/api/category", {
            method: "post",
            body: JSON.stringify({productId: id}),
        })
            .then((res) => res.json())
            .then((data) => {
                setUserCategories((prev) =>
                    prev.filter((item) => item.categoryid !== id)
                );
            })
            .catch((error) => console.error(error));
    };

    const handleRemoveCheck = (id) => {
        setCategories((prev) =>
            prev.map((item) =>
                item.id !== id ? item : {...item, checked: !item.checked}
            )
        );
        setDisplayCategories((prev) =>
            prev.map((item) =>
                item.id !== id ? item : {...item, checked: !item.checked}
            )
        );
    };

    const handleChangePage = (i) => {
        if (i > pages.length) return;
        if (i < 1) return;
        const pageEnd = perPage * i;
        const pageStart = perPage * (i - 1);
        const arr = [];
        for (let index = pageStart; index < pageEnd; index++) {
            if (categories[index]) {
                arr.push(categories[index]);
            }
        }
        setDisplayCategories(arr);
        setCurrentPage(i);
    };

    return (
        <div className="flex flex-col rounded bg-white pb-7">
            <div
                className="max-md:mt-10 mt-20 ml-20 flex max-w-full flex-col items-start self-center rounded-3xl border border-solid border-stone-300 bg-white max-md:px-5 px-16 pt-12 pb-20 text-base leading-7 text-black w-[576px]">
                <div className="ml-5 text-center text-3xl font-semibold text-black max-md:ml-2.5">
                    Please mark your interests!
                </div>
                <div className="mt-8 self-center">We will keep you notified.</div>
                <div
                    className="max-md:mt-10 mt-12 mb-4 max-md:max-w-full self-stretch pl-10 text-xl font-medium leading-7">
                    My saved interests!
                </div>
                <div className="flex w-full items-center justify-center">
                    {loading ? <Loading/> : ""}
                </div>
                <div className="pl-10">
                    {displayCategories.map((item) => (
                        <label
                            key={uuid()}
                            className="flex cursor-pointer items-center gap-2 text-2xl font-semibold capitalize"
                        >
                            <input
                                checked={item.checked}
                                type="checkbox"
                                className="cursor-pointer accent-black size-6"
                                onChange={() => {
                                    handleInputChange(item.id);
                                    handleRemoveCheck(item.id);
                                }}
                            />
                            {item.name}
                        </label>
                    ))}
                </div>
                <div
                    className="mt-10 max-md:mt-10 ml-10 max-md:max-w-full self-stretch text-xl font-medium leading-7 text-black">
          <span
              className={`mx-1 cursor-pointer`}
              onClick={() => handleChangePage(1)}
          >
            &lt;&lt;
          </span>
                    <span
                        className={`mx-1 cursor-pointer`}
                        onClick={() => handleChangePage(currentPage - 1)}
                    >
            &lt;
          </span>

                    {pages.map((item) => (
                        <span
                            key={uuid()}
                            className={`${
                                item === currentPage
                                    ? "font-semibold text-black"
                                    : "font-normal text-gray-700"
                            } mr-1 cursor-pointer`}
                            onClick={() => handleChangePage(item)}
                        >
              {item}
            </span>
                    ))}

                    <span
                        className={`mx-1 cursor-pointer`}
                        onClick={() => handleChangePage(currentPage + 1)}
                    >
            &gt;
          </span>
                    <span
                        className={`mx-1 cursor-pointer`}
                        onClick={() => handleChangePage(pages.length)}
                    >
            &gt;&gt;
          </span>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
