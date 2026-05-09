"use client";

import { useState, useEffect, useCallback } from "react";
import { getStoredUser } from "@/lib/kakaoAuth";
import type { HustleQuestion, HustleAnswer } from "@/lib/types";

/* ─── 날짜 포맷 ────────────────────────────────────────── */
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "방금";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

/* ─── 답변 영역 (단일 질문 안에서 펼침) ─────────────────── */
function AnswerSection({
  question,
  kakaoUserId,
  kakaoNickname,
}: {
  question: HustleQuestion;
  kakaoUserId: string | null;
  kakaoNickname: string;
}) {
  const [answers, setAnswers]       = useState<HustleAnswer[]>([]);
  const [loading, setLoading]       = useState(true);
  const [content, setContent]       = useState("");
  const [nickname, setNickname]     = useState(kakaoNickname);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/hustle-questions/${question.id}/answers`);
    if (res.ok) setAnswers(await res.json());
    setLoading(false);
  }, [question.id]);

  useEffect(() => { load(); }, [load]);

  // 카카오 닉네임이 나중에 로드되면 동기화
  useEffect(() => { setNickname(kakaoNickname); }, [kakaoNickname]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;
    setSubmitting(true);
    setError("");
    const res = await fetch(`/api/hustle-questions/${question.id}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: nickname.trim(),
        content: content.trim(),
        kakao_user_id: kakaoUserId,
      }),
    });
    if (res.ok) {
      const newAnswer: HustleAnswer = await res.json();
      setAnswers((prev) => [...prev, newAnswer]);
      setContent("");
    } else {
      const data = await res.json();
      setError(data.error ?? "오류가 발생했어요");
    }
    setSubmitting(false);
  }

  async function handleDelete(answerId: string) {
    if (!kakaoUserId) return;
    await fetch(`/api/hustle-answers/${answerId}`, { method: "DELETE" });
    setAnswers((prev) => prev.filter((a) => a.id !== answerId));
  }

  return (
    <div className="pl-4 border-l-2 border-indigo-100 mt-3 space-y-3">
      {loading ? (
        <div className="h-3 bg-slate-100 rounded w-1/3 animate-pulse" />
      ) : answers.length === 0 ? (
        <p className="text-xs text-slate-400">아직 답변이 없어요. 첫 답변을 남겨주세요!</p>
      ) : (
        answers.map((a) => (
          <div
            key={a.id}
            className={`rounded-xl px-3 py-2.5 text-sm ${
              a.is_best
                ? "bg-amber-50 border border-amber-200"
                : "bg-slate-50 border border-slate-100"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              {a.is_best && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                  ✓ 채택
                </span>
              )}
              <span className="font-semibold text-slate-700 text-xs">{a.nickname}</span>
              <span className="text-slate-300 text-[10px]">·</span>
              <span className="text-slate-400 text-[10px]">{timeAgo(a.created_at)}</span>
              {kakaoUserId && a.kakao_user_id === kakaoUserId && (
                <button
                  onClick={() => handleDelete(a.id)}
                  className="ml-auto text-[10px] text-slate-300 hover:text-red-400 transition-colors"
                >
                  삭제
                </button>
              )}
            </div>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{a.content}</p>
          </div>
        ))
      )}

      {/* 답변 입력 */}
      <form onSubmit={handleSubmit} className="pt-1">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            maxLength={20}
            className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          />
        </div>
        <div className="flex gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="답변을 입력하세요 (5자 이상)"
            rows={2}
            maxLength={1000}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !content.trim() || !nickname.trim()}
            className="flex-shrink-0 self-end bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            {submitting ? "..." : "답변"}
          </button>
        </div>
        {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
      </form>
    </div>
  );
}

/* ─── 질문 카드 ─────────────────────────────────────────── */
function QuestionCard({
  question,
  kakaoUserId,
  kakaoNickname,
  onDelete,
}: {
  question: HustleQuestion;
  kakaoUserId: string | null;
  kakaoNickname: string;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  async function handleDelete() {
    if (!kakaoUserId) return;
    await fetch(`/api/hustle-questions/${question.id}`, { method: "DELETE" });
    onDelete(question.id);
  }

  return (
    <div className="card p-4">
      {/* 질문 헤더 */}
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs flex-shrink-0 mt-0.5">
          Q
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-semibold text-slate-700 text-sm">{question.nickname}</span>
            <span className="text-slate-300 text-xs">·</span>
            <span className="text-slate-400 text-xs">{timeAgo(question.created_at)}</span>
            {kakaoUserId && question.kakao_user_id === kakaoUserId && (
              <button
                onClick={handleDelete}
                className="ml-auto text-[10px] text-slate-300 hover:text-red-400 transition-colors"
              >
                삭제
              </button>
            )}
          </div>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {question.content}
          </p>

          {/* 답변 토글 버튼 */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            <span>💬</span>
            <span>
              {question.answer_count > 0
                ? `답변 ${question.answer_count}개`
                : "답변하기"}
            </span>
            <span className="text-slate-400">{expanded ? "▲" : "▼"}</span>
          </button>
        </div>
      </div>

      {/* 답변 섹션 (펼침) */}
      {expanded && (
        <div className="mt-3">
          <AnswerSection
            question={question}
            kakaoUserId={kakaoUserId}
            kakaoNickname={kakaoNickname}
          />
        </div>
      )}
    </div>
  );
}

/* ─── 메인 HustleQnA 컴포넌트 ──────────────────────────── */
interface Props {
  hustleId: string;
  hustleName: string;
}

export default function HustleQnA({ hustleId, hustleName }: Props) {
  const [questions, setQuestions] = useState<HustleQuestion[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);

  // 질문 작성 폼 상태
  const [showForm, setShowForm]     = useState(false);
  const [qContent, setQContent]     = useState("");
  const [qNickname, setQNickname]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  // 카카오 유저 (id는 number → string 변환해서 사용)
  const [kakaoUserId, setKakaoUserId]       = useState<string | null>(null);
  const [kakaoNickname, setKakaoNickname]   = useState("");

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setKakaoUserId(String(user.id));
      setKakaoNickname(user.nickname ?? "");
      setQNickname(user.nickname ?? "");
    }
  }, []);

  const load = useCallback(async (p: number, append = false) => {
    setLoading(true);
    const res = await fetch(`/api/hustle-questions?hustle_id=${hustleId}&page=${p}`);
    if (res.ok) {
      const { questions: items, total: t } = await res.json() as {
        questions: HustleQuestion[];
        total: number;
      };
      setQuestions((prev) => append ? [...prev, ...items] : items);
      setTotal(t);
    }
    setLoading(false);
  }, [hustleId]);

  useEffect(() => { load(1); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!qNickname.trim() || !qContent.trim()) return;
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/hustle-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hustle_id: hustleId,
        nickname: qNickname.trim(),
        content: qContent.trim(),
        kakao_user_id: kakaoUserId,
      }),
    });

    if (res.ok) {
      const newQ: HustleQuestion = await res.json();
      setQuestions((prev) => [newQ, ...prev]);
      setTotal((t) => t + 1);
      setQContent("");
      setShowForm(false);
    } else {
      const data = await res.json();
      setError(data.error ?? "오류가 발생했어요");
    }
    setSubmitting(false);
  }

  function handleDelete(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setTotal((t) => Math.max(0, t - 1));
  }

  function loadMore() {
    const next = page + 1;
    setPage(next);
    load(next, true);
  }

  const hasMore = questions.length < total;

  return (
    <section>
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          ❓ Q&amp;A
          {total > 0 && (
            <span className="text-sm font-normal text-slate-400">{total}개</span>
          )}
        </h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          {showForm ? "취소" : "+ 질문하기"}
        </button>
      </div>

      {/* 질문 작성 폼 */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="card p-4 mb-4 border-2 border-indigo-200 bg-indigo-50/30"
        >
          <p className="text-xs font-semibold text-indigo-700 mb-3">
            {hustleName}에 대해 궁금한 점을 물어보세요
          </p>
          <input
            type="text"
            value={qNickname}
            onChange={(e) => setQNickname(e.target.value)}
            placeholder="닉네임"
            maxLength={20}
            className="w-full mb-2 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          />
          <textarea
            value={qContent}
            onChange={(e) => setQContent(e.target.value)}
            placeholder={`${hustleName} 부업에 대해 궁금한 것을 질문하세요 (10자 이상)`}
            rows={3}
            maxLength={500}
            className="w-full mb-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{qContent.length}/500</span>
            <button
              type="submit"
              disabled={submitting || qContent.trim().length < 10 || !qNickname.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              {submitting ? "등록 중..." : "질문 등록"}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </form>
      )}

      {/* 질문 목록 */}
      {loading && questions.length === 0 ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-3 bg-slate-100 rounded w-1/4 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-2xl mb-2">🙋</p>
          <p className="text-slate-600 font-semibold mb-1">{hustleName}에 대한 질문이 없어요</p>
          <p className="text-sm text-slate-400">첫 번째 질문을 남겨보세요!</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            질문하기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              kakaoUserId={kakaoUserId}
              kakaoNickname={kakaoNickname}
              onDelete={handleDelete}
            />
          ))}

          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full py-3 text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "불러오는 중..." : `더 보기 (${total - questions.length}개 남음)`}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
