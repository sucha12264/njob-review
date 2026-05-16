"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ALL_HUSTLES, searchHustles } from "@/lib/hustleData";
import { useStore } from "@/lib/store";


const RECENT_KEY = "njob_recent_searches";
const MAX_RECENT = 6;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function addRecentSearch(name: string) {
  try {
    const prev = getRecentSearches().filter((n) => n !== name);
    localStorage.setItem(RECENT_KEY, JSON.stringify([name, ...prev].slice(0, MAX_RECENT)));
  } catch { /* 무시 */ }
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const { reviews } = useStore();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // 검색 결과: query가 있으면 검색, 없으면 인기 부업
  const results = query.trim()
    ? searchHustles(query.trim()).slice(0, 8)
    : ALL_HUSTLES.filter((h) => h.isHot).slice(0, 8);

  // 모달 열릴 때 input 포커스 + 최근 검색어 로드
  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // ESC 닫기 + Ctrl+K 열기
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!open) return; // SearchTrigger에서 처리
      }
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // 키보드 네비게이션
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      } else if (e.key === "Enter") {
        const hustle = results[cursor];
        if (hustle) navigate(hustle.id, hustle.name);
      }
    },
    [results, cursor]
  );

  function navigate(id: string, name: string) {
    addRecentSearch(name);
    onClose();
    router.push(`/hustle/${id}`);
  }

  // cursor가 리스트 밖으로 나가지 않도록
  useEffect(() => {
    setCursor(0);
  }, [query]);

  // cursor 위치로 스크롤
  useEffect(() => {
    const el = listRef.current?.children[cursor] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  if (!open) return null;

  // 리뷰 수 계산
  const reviewCount = (hustleId: string) =>
    reviews.filter((r) => r.hustle_id === hustleId).length;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* 입력창 */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <span className="text-slate-400 text-lg flex-shrink-0">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="부업 이름으로 검색... (예: 쿠팡파트너스, 크몽)"
            className="flex-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 text-xl flex-shrink-0"
            >
              ×
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded flex-shrink-0">
            ESC
          </kbd>
        </div>

        {/* 최근 검색어 (query 없을 때) */}
        {!query && recentSearches.length > 0 && (
          <div className="px-4 pt-3 pb-1">
            <p className="text-[11px] font-semibold text-slate-400 mb-2">최근 검색</p>
            <div className="flex flex-wrap gap-1.5">
              {recentSearches.map((name) => {
                const hustle = ALL_HUSTLES.find((h) => h.name === name);
                return (
                  <button
                    key={name}
                    onClick={() => hustle && navigate(hustle.id, hustle.name)}
                    className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 px-2.5 py-1 rounded-full transition-colors"
                  >
                    🕐 {name}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  localStorage.removeItem(RECENT_KEY);
                  setRecentSearches([]);
                }}
                className="text-[11px] text-slate-300 hover:text-red-400 px-2 transition-colors"
              >
                초기화
              </button>
            </div>
          </div>
        )}

        {/* 결과 목록 */}
        <ul ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 && query ? (
            <li className="px-4 py-8 text-center">
              <p className="text-slate-400 text-sm">
                &ldquo;{query}&rdquo;에 맞는 부업이 없어요
              </p>
              <p className="text-xs text-slate-300 mt-1">다른 키워드로 검색해보세요</p>
            </li>
          ) : (
            results.map((hustle, i) => {
              const cnt = reviewCount(hustle.id);
              return (
                <li key={hustle.id}>
                  <button
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => navigate(hustle.id, hustle.name)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      i === cursor ? "bg-indigo-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0 w-9 text-center">{hustle.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-800 truncate">
                          {hustle.name}
                        </span>
                        {hustle.isHot && (
                          <span className="text-[10px] font-bold bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full flex-shrink-0">🔥 HOT</span>
                        )}
                        {hustle.isNew && !hustle.isHot && (
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded-full flex-shrink-0">NEW</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400">{hustle.category}</span>
                        <span className="text-slate-200">·</span>
                        <span className="text-xs font-semibold text-slate-500">
                          {hustle.incomeRange}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {cnt > 0 ? (
                        <span className="text-[11px] font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                          후기 {cnt}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-300">후기 없음</span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        {/* 하단 힌트 */}
        <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            {query
              ? `${results.length}개 결과`
              : "🔥 인기 부업"}
          </span>
          <span className="hidden sm:flex items-center gap-3">
            <span>↑↓ 이동</span>
            <span>↵ 선택</span>
          </span>
        </div>
      </div>
    </div>
  );
}
