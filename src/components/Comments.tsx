"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { getStoredUser } from "@/lib/kakaoAuth";

interface Comment {
  id: string;
  created_at: string;
  review_id: string;
  nickname: string;
  content: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return `${Math.floor(days / 7)}주 전`;
}

export default function Comments({ reviewId }: { reviewId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 카카오 로그인 닉네임 자동 입력
  useEffect(() => {
    const user = getStoredUser();
    if (user?.nickname) setNickname(user.nickname);
  }, []);

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("review_id", reviewId)
        .order("created_at", { ascending: true });
      if (!error && data) setComments(data as Comment[]);
    } finally {
      setLoading(false);
    }
  }, [reviewId]);

  useEffect(() => {
    loadComments();

    // 실시간 구독 — 새 댓글 즉시 반영
    const channel = supabase
      .channel(`comments:${reviewId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `review_id=eq.${reviewId}` },
        (payload) => {
          setComments((prev) => [...prev, payload.new as Comment]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [reviewId, loadComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;
    if (content.length > 500) {
      setError("댓글은 500자 이내로 작성해주세요.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("comments")
        .insert({ review_id: reviewId, nickname: nickname.trim(), content: content.trim() });
      if (error) throw error;
      setContent("");
    } catch {
      setError("댓글 등록에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        💬 댓글
        {!loading && (
          <span className="text-sm font-normal text-slate-400">{comments.length}개</span>
        )}
      </h3>

      {/* 댓글 목록 */}
      <div className="space-y-3 mb-6">
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse bg-slate-50 rounded-xl p-4">
                <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">
            아직 댓글이 없어요. 첫 번째 댓글을 남겨보세요!
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold text-slate-700">{c.nickname}</span>
                <span className="text-xs text-slate-400">{timeAgo(c.created_at)}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{c.content}</p>
            </div>
          ))
        )}
      </div>

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleSubmit} className="border border-slate-200 rounded-xl p-4 bg-white">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            maxLength={20}
            className="w-28 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
          />
          <div className="flex-1 relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="궁금한 점이나 경험을 댓글로 남겨주세요..."
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1.5"
          >
            {submitting ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            댓글 등록
          </button>
        </div>
      </form>
    </div>
  );
}
