"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { BoardCategory } from "@/lib/types";
import {
  BOARD_CATEGORIES,
  BOARD_CATEGORY_EMOJI,
} from "@/lib/types";
import { getStoredUser } from "@/lib/kakaoAuth";

export default function BoardWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<BoardCategory>("자유수다");
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getStoredUser();
    if (user?.nickname) setNickname(user.nickname);
  }, []);

  const isValid =
    title.trim().length >= 2 &&
    content.trim().length >= 10 &&
    nickname.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setError("");
    try {
      const user = getStoredUser();
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          content: content.trim(),
          nickname: nickname.trim(),
          kakao_user_id: user ? String(user.id) : null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { error?: string }).error ?? "오류가 발생했어요"
        );
      }
      const post = await res.json() as { id: string };
      router.push(`/board/${post.id}`);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "오류가 발생했어요. 다시 시도해주세요."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">
      <Link
        href="/board"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        ← 게시판으로
      </Link>

      <div className="card p-5 sm:p-8">
        <h1 className="text-xl font-black text-slate-800 mb-6">글쓰기</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              카테고리 *
            </label>
            <div className="flex flex-wrap gap-2">
              {BOARD_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                    category === cat
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-500 hover:border-indigo-300"
                  }`}
                >
                  {BOARD_CATEGORY_EMOJI[cat]} {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              maxLength={100}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none"
            />
            {title.length > 0 && title.trim().length < 2 && (
              <p className="text-xs text-red-400 mt-1">
                제목은 2자 이상 입력해주세요
              </p>
            )}
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              내용 *{" "}
              <span className="font-normal text-slate-400">(최소 10자)</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`자유롭게 작성해주세요.\n경험 공유, 질문, 수익 인증 무엇이든 환영해요!`}
              rows={8}
              maxLength={3000}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none resize-none"
            />
            <div className="flex justify-between mt-1">
              {content.length > 0 && content.trim().length < 10 ? (
                <p className="text-xs text-red-400">
                  {10 - content.trim().length}자 더 필요해요
                </p>
              ) : (
                <span />
              )}
              <p className="text-xs text-slate-400">{content.length}/3000</p>
            </div>
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              닉네임 *
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예: 직장인A"
              maxLength={20}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Link
              href="/board"
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold text-center hover:bg-slate-50 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {submitting && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {submitting ? "등록 중..." : "게시하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
