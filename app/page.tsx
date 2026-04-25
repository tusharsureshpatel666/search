"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function SearchTest() {
  const [query, setQuery] = useState("");
  const [datas, setDatas] = useState<any[]>([]);
  const [copyList, setCopyList] = useState<string[]>([]);

  useEffect(() => {
    const handleres = async () => {
      const res = await fetch("/test.json");
      const data = await res.json();
      setDatas(data);
    };
    handleres();
  }, []);
  const addToCopyList = (code: string) => {
    setCopyList((prev) => {
      if (prev.includes(code)) return prev; // avoid duplicate
      return [...prev, code];
    });
  };
  const removeFromCopyList = (code: string) => {
    setCopyList((prev) => prev.filter((item) => item !== code));
  };
  const clearCopyList = () => {
    setCopyList([]);
  };

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check Ctrl + number
      if (e.ctrlKey && /^[1-9]$/.test(e.key)) {
        e.preventDefault(); // stop browser default

        const index = Number(e.key) - 1;
        const code = copyList[index];

        if (code) {
          navigator.clipboard.writeText(code);
          toast.success(`Copied: ${code}`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copyList]);

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

      <div className="mb-6 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Copied List
          </p>

          {/* <button
            onClick={copyAll}
            className="text-xs px-3 py-1.5 rounded-xl bg-black text-white 
      dark:bg-white dark:text-black hover:opacity-80 transition"
          >
            Copy All
          </button> */}
        </div>

        {/* List */}
        <div className="flex flex-wrap gap-3">
          {copyList.map((code, index) => (
            <div
              key={index}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl 
        bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
        hover:shadow-md transition"
            >
              {/* Index */}
              <span className="text-xs text-gray-400 w-5">{index + 1}.</span>

              {/* Code */}
              <span className="font-mono text-sm text-gray-800 dark:text-gray-200">
                {code}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 ml-2  transition">
                <button
                  onClick={() => handleCopy(code)}
                  className="text-xs px-2 py-1 rounded-md 
            bg-black text-white cursor-pointer dark:bg-white dark:text-black 
            hover:scale-95 transition"
                >
                  Copy
                </button>

                <button
                  onClick={() => removeFromCopyList(code)}
                  className="text-xs px-2 cursor-pointer py-1 rounded-md 
            bg-red-500 text-white 
            hover:scale-95 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Hint */}
        {copyList.length > 0 && (
          <p className="text-xs text-gray-400 mt-4">
            Tip: Press <span className="font-medium">Ctrl + 1, 2, 3...</span> to
            quickly copy items
          </p>
        )}
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
              <button
                className="text-sm px-4 py-1.5 rounded-xl border cursor-pointer 
                border-gray-300 bg-white text-black
                dark:border-gray-600 dark:bg-gray-800 dark:text-white
                hover:bg-black hover:text-white 
                dark:hover:bg-white dark:hover:text-black
                transition-all duration-300 active:scale-95"
                onClick={() => addToCopyList(item.code)}
              >
                Add
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
