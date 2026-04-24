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
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-black transition-colors duration-300">
      <Toaster position="top-center" />

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search test (e.g. HbA1c, sugar, CBC...)"
          className="w-full p-4 pl-5 pr-5 border rounded-2xl shadow-sm 
          bg-white text-black border-gray-200 
          dark:bg-gray-900 dark:text-white dark:border-gray-700
          focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white 
          transition"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {filtered.slice(0, 30).map((item, index) => (
          <div
            key={index}
            className="group p-5 rounded-2xl border 
            border-gray-200 bg-white 
            dark:border-gray-700 dark:bg-gray-900
            hover:shadow-xl hover:-translate-y-1 
            dark:hover:shadow-gray-800/40
            transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top */}
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
                Test Name
              </p>

              <p
                className="font-semibold text-lg text-gray-900 
              dark:text-white group-hover:text-black dark:group-hover:text-gray-200 transition"
              >
                {item.name}
              </p>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between mt-6">
              <span
                className="font-mono text-sm px-3 py-1 rounded-lg
                bg-gray-100 text-gray-700
                dark:bg-gray-800 dark:text-gray-300"
              >
                {item.code}
              </span>

              <button
                onClick={() => handleCopy(item.code)}
                className="text-sm px-4 py-1.5 rounded-xl border cursor-pointer 
                border-gray-300 bg-white text-black
                dark:border-gray-600 dark:bg-gray-800 dark:text-white
                hover:bg-black hover:text-white 
                dark:hover:bg-white dark:hover:text-black
                transition-all duration-300 active:scale-95"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
          No results found
        </p>
      )}
    </div>
  );
}
