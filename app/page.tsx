"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function SearchTest() {
  const [query, setQuery] = useState("");
  const [datas, setDatas] = useState<any[]>([]);

  useEffect(() => {
    const handleres = async () => {
      const res = await fetch("/test.json");
      const data = await res.json();
      setDatas(data);
    };
    handleres();
  }, []);

  const normalize = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]/g, "");

  const filtered = datas.filter(
    (item) =>
      normalize(item.name).includes(normalize(query)) ||
      normalize(item.code).includes(normalize(query)),
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied: ${code}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster position="top-center" />

      {/* 🔍 Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search test (e.g. HbA1c, sugar, CBC...)"
          className="w-full p-4 pl-5 pr-5 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* 🧱 Grid Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.slice(0, 30).map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl border  hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <p className="text-sm text-gray-500 mb-1">Test Name</p>
              <p className="font-semibold text-lg">{item.name}</p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="font-bold ">{item.code}</span>

              <button
                onClick={() => handleCopy(item.code)}
                className="text-sm px-3 py-1 cursor-pointer rounded-lg border hover:bg-black hover:text-white transition"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 😶 Empty state */}
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No results found</p>
      )}
    </div>
  );
}
