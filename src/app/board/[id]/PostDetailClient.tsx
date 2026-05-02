"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Post, PostComment, BoardCategory } from "@/lib/types";
import { BOARD_CATEGORY_COLORS, BOARD_CATEGORY_EMOJI } from "@/lib/types";
import { getStoredUser } from "@/lib/kakaoAuth";

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

// ─── 댓글 섹션 ────────────────────────────────────────
function PostComments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getStoredUser();
    if (user?.nickname) setNickname(user.nickname);
  }, []);

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/post-comments?post_id=${postId}`);
      if (res.ok) setComments(await res.json());
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      const user = getStoredUser();
      const res = await fetch("/api/post-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          nickname: nickname.trim(),
          content: content.trim(),
          kakao_user_id: user ? String(user.id) : null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "등록 실패");
      }
      const newComment: PostComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setContent("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "댓글 등록에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        💬 댓글
        {!loading && (
          <span className="text-sm font-normal text-slate-400">
            {comments.length}개
          </span>
        )}
      </h3>

      {/* 댓글 목록 */}
      <div className="space-y-3 mb-6">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-slate-50 rounded-xl p-4">
              <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-3/4 bg-slate-100 rounded" />
            </div>
          ))
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">
            아직 댓글이 없어요. 첫 번째 댓글을 남겨보세요!
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold text-slate-700">
                  {c.nickname}
                </span>
                <span className="text-xs text-slate-400">
                  {timeAgo(c.created_at)}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 댓글 작성 폼 */}
      <form
        onSubmit={handleSubmit}
        className="border border-slate-200 rounded-xl p-4 bg-white"
      >
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            maxLength={20}
            className="w-full sm:w-28 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
          />
          <div className="flex-1 relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="댓글을 남겨주세요..."
              rows={2}
              maxLength={500}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none"
            />
            <span className="absolute right-2 bottom-2 text-[10px] text-slate-300">
              {content.length}/500
            </span>
          </div>
        </div>
        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!nickname.trim() || !content.trim() || submitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1.5 w-full sm:w-auto justify-center"
          >
            {submitting && (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            댓글 등록
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── 메인 컴포넌트 ─────────────────────────────────────
export default function PostDetailClient({ post }: { post: Post }) {
  const router = useRouter();
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // 조회수 증가 (fire-and-forget)
    fetch(`/api/posts/${post.id}/view`, { method: "POST" }).catch(() => {});
    // 좋아요 상태
    setLiked(!!localStorage.getItem(`post_liked_${post.id}`));
    // 작성자 확인
    const user = getStoredUser();
    if (user && post.kakao_user_id && String(user.id) === post.kakao_user_id) {
      setIsOwner(true);
    }
  }, [post.id, post.kakao_user_id]);

  async function handleLike() {
    const key = `post_liked_${post.id}`;
    const action = liked ? "unlike" : "like";
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json() as { likes: number };
      setLikes(json.likes);
      if (action === "like") {
        localStorage.setItem(key, "1");
        setLiked(true);
      } else {
        localStorage.removeItem(key);
        setLiked(false);
      }
    } catch {}
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDelete() {
    if (!confirm("이 글을 삭제할까요? 되돌릴 수 없습니다.")) return;
    setDeleting(true);
    const user = getStoredUser();
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kakao_user_id: String(user?.id) }),
    });
    if (res.ok) {
      router.push("/board");
    } else {
      alert("삭제에 실패했어요.");
      setDeleting(false);
    }
  }

  const colorClass =
    BOARD_CATEGORY_COLORS[post.category as BoardCategory] ??
    "bg-slate-100 text-slate-600";
  const emoji =
    BOARD_CATEGORY_EMOJI[post.category as BoardCategory] ?? "💬";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">
      <Link
        href="/board"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        ← 게시판으로
      </Link>

      <div className="card p-5 sm:p-8">
        {/* 카테고리 */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>
            {emoji} {post.category}
          </span>
        </div>

        {/* 제목 */}
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 leading-snug">
          {post.title}
        </h1>

        {/* 메타 */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
          <span className="font-semibold text-slate-600">{post.nickname}</span>
          <span>·</span>
          <span>{timeAgo(post.created_at)}</span>
          <span>·</span>
          <span className="flex items-center gap-1">👁 {post.views}</span>
        </div>

        {/* 본문 */}
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-8 text-[15px]">
          {post.content}
        </p>

        {/* 액션 바 */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-all active:scale-95 ${
              liked
                ? "bg-red-50 border-red-200 text-red-500"
                : "bg-white border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-400"
            }`}
          >
            <span className="text-base">{liked ? "❤️" : "🤍"}</span>
            <span>좋아요 {likes}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`text-sm px-3 py-2 rounded-full border transition-all ${
                copied
                  ? "border-green-300 bg-green-50 text-green-600"
                  : "border-slate-200 text-slate-400 hover:border-slate-300"
              }`}
            >
              {copied ? "✓ 복사됨" : "🔗 공유"}
            </button>
            <Link
              href="/board/write"
              className="text-sm px-3 py-2 rounded-full border border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              ✏️ 글쓰기
            </Link>
            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1.5 rounded transition-colors disabled:opacity-40"
              >
                {deleting ? "삭제 중..." : "🗑 삭제"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 댓글 */}
      <div className="card p-5 sm:p-8 mt-4">
        <PostComments postId={post.id} />
      </div>

      <div className="h-4 sm:h-0" />
    </div>
  );
}
