"use client";

import { useState, useEffect } from "react";
import SearchModal from "./SearchModal";

export default function SearchTrigger() {
  const [open, setOpen] = useState(false);

  // Ctrl+K / Cmd+K 단축키
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
        aria-label="부업 검색"
      >
        <span>🔍</span>
        <span className="hidden md:inline text-sm">검색</span>
        <kbd className="hidden lg:flex items-center gap-0.5 text-[10px] text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded ml-1">
          ⌘K
        </kbd>
      </button>

      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
