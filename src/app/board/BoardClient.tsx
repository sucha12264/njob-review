"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Post, BoardCategory } from "@/lib/types";
import {
  BOARD_CATEGORIES,
  BOARD_CATEGORY_COLORS,
  BOARD_CATEGORY_EMOJI,
} from "@/lib/types";

const ALL_TABS = ["전체", ...BOARD_CATEGORIES] as const;
type Tab = "전체" | BoardCategory;

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}일 전`;
  return `${Math.floor(d / 7)}주 전`;
}

function PostCard({ post }: { post: Post }) {
  const color =
    BOARD_CATEGORY_COLORS[post.category as BoardCategory] ??
    "bg-slate-100 text-slate-600";
  const emoji =
    BOARD_CATEGORY_EMOJI[post.category as BoardCategory] ?? "💬";

  return (
    <Link href={`/board/${post.id}`} className="block group">
      <div className="card p-4 sm:p-5 hover:border-indigo-200 transition-all hover:shadow-md group-active:scale-[0.99]">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${color}`}
          >
            {emoji} {post.category}
          </span>
        </div>
        <h2 className="font-bold text-slate-800 text-[15px] group-hover:text-indigo-700 transition-colors line-clamp-2 mb-1.5 leading-snug">
          {post.title}
        </h2>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {post.content}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
          <span className="font-medium text-slate-500">{post.nickname}</span>
          <span>·</span>
          <span>{timeAgo(post.created_at)}</span>
          <div className="ml-auto flex items-center gap-3">
            <span>👁 {post.views}</span>
            <span>💬 {post.comment_count}</span>
            <span>🤍 {post.likes}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PostSkeleton() {
  return (
    <div className="card p-4 sm:p-5 animate-pulse">
      <div className="h-4 w-16 bg-slate-200 rounded-full mb-2" />
      <div className="h-5 w-3/4 bg-slate-200 rounded mb-2" />
      <div className="space-y-1.5 mb-3">
        <div className="h-3.5 w-full bg-slate-100 rounded" />
        <div className="h-3.5 w-2/3 bg-slate-100 rounded" />
      </div>
      <div className="flex gap-3">
        <div className="h-3 w-16 bg-slate-100 rounded" />
        <div className="h-3 w-12 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

export default function BoardClient() {
  const [tab, setTab] = useState<Tab>("전체");
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(
    async (cat: Tab, pg: number, append = false) => {
      append ? setLoadingMore(true) : setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(pg) });
        if (cat !== "전체") params.set("category", cat);
        const res = await fetch(`/api/posts?${params}`);
        const json = (await res.json()) as { posts: Post[]; total: number };
        setPosts((prev) => (append ? [...prev, ...json.posts] : json.posts));
        setTotal(json.total);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    fetchPosts(tab, 1, false);
  }, [tab, fetchPosts]);

  function handleTabChange(next: Tab) {
    setTab(next);
  }

  function loadMore() {
    const next = page + 1;
    setPage(next);
    fetchPosts(tab, next, true);
  }

  const hasMore = posts.length < total;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-slate-800">자유게시판</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            N잡러들의 솔직한 이야기
          </p>
        </div>
        <Link
          href="/board/write"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 active:scale-95 shadow-sm"
        >
          ✏️ <span className="hidden sm:inline">글쓰기</span>
          <span className="sm:hidden">글쓰기</span>
        </Link>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide -mx-4 px-4">
        {ALL_TABS.map((t) => (
          <button
            key={t}
            onClick={() => handleTabChange(t as Tab)}
            className={`whitespace-nowrap text-sm font-semibold px-4 py-2 rounded-full transition-all flex-shrink-0 ${
              tab === t
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t === "전체"
              ? "🔥 전체"
              : `${BOARD_CATEGORY_EMOJI[t as BoardCategory]} ${t}`}
          </button>
        ))}
      </div>

      {/* 글 목록 */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-bold text-slate-700 mb-1.5">
            {tab === "전체" ? "아직 글이 없어요" : `'${tab}' 글이 없어요`}
          </p>
          <p className="text-sm text-slate-400 mb-6">
            첫 번째 글을 남겨보세요!
          </p>
          <Link
            href="/board/write"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            ✏️ 글쓰기
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 mx-auto text-sm text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-300 px-6 py-2.5 rounded-xl transition-all disabled:opacity-40"
              >
                {loadingMore && (
                  <span className="w-4 h-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
                )}
                {loadingMore
                  ? "불러오는 중..."
                  : `더 보기 (${total - posts.length}개 남음)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
