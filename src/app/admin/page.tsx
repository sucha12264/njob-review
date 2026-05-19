"use client";

import { useState, useEffect, useCallback } from "react";
import type { Review } from "@/lib/types";
import { INCOME_LABELS, type IncomeRange } from "@/lib/types";
import { ALL_HUSTLES } from "@/lib/hustleData";

// ─── 타입 ─────────────────────────────────────────────
interface Comment {
  id: string;
  created_at: string;
  review_id: string;
  nickname: string;
  content: string;
  kakao_user_id: string | null;
}

interface Report {
  id: string;
  created_at: string;
  type: "review" | "comment";
  target_id: string;
  reason: string;
  reporter_ip: string | null;
  status: "pending" | "resolved" | "dismissed";
}

type Tab = "reviews" | "comments" | "clicks" | "reports" | "write" | "hustles";

// ─── 유틸 ─────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "오늘";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}달 전`;
}

// ─── 메인 컴포넌트 ─────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [clickStats, setClickStats] = useState<{ hustle_name: string; count: number }[]>([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0, withProof: 0, totalComments: 0 });
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("reviews");
  const [search, setSearch] = useState("");
  const [commentSearch, setCommentSearch] = useState("");
  const [reportSearch, setReportSearch] = useState("");
  const [filterHustle, setFilterHustle] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [resolvingReportId, setResolvingReportId] = useState<string | null>(null);

  // ─── API 헬퍼 ─────────────────────────────────────────
  const adminFetch = useCallback(
    (path: string, options: RequestInit = {}) =>
      fetch(path, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": pw,
          ...(options.headers ?? {}),
        },
      }),
    [pw]
  );

  // ─── 데이터 로드 ─────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [revRes, cmmRes, clkRes, rptRes] = await Promise.all([
        adminFetch("/api/admin/reviews"),
        adminFetch("/api/admin/comments"),
        adminFetch("/api/admin/clicks"),
        adminFetch("/api/admin/reports"),
      ]);

      if (revRes.ok) {
        const { reviews: rev, stats: st } = await revRes.json() as {
          reviews: Review[];
          stats: { total: number; today: number; withProof: number };
        };
        setReviews(rev);
        setStats((prev) => ({ ...prev, ...st }));
      }
      if (cmmRes.ok) {
        const { comments: cmm } = await cmmRes.json() as { comments: Comment[] };
        setComments(cmm);
        setStats((prev) => ({ ...prev, totalComments: cmm.length }));
      }
      if (clkRes.ok) {
        const { stats: cls, total: clkTotal } = await clkRes.json() as { stats: { hustle_name: string; count: number }[]; total: number };
        setClickStats(cls);
        setTotalClicks(clkTotal ?? 0);
      }
      if (rptRes.ok) {
        const { reports: rpt } = await rptRes.json() as { reports: Report[] };
        setReports(rpt);
      }
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  // ─── 로그인 ─────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        setAuthed(true);
      } else {
        alert("비밀번호가 틀렸어요.");
        setPw("");
      }
    } finally {
      setAuthLoading(false);
    }
  }

  // ─── 삭제 / 상태변경 ──────────────────────────────────
  async function deleteReview(id: string) {
    if (!confirm("이 후기를 삭제할까요? 되돌릴 수 없습니다.")) return;
    setDeletingId(id);
    const res = await adminFetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setComments((prev) => prev.filter((c) => c.review_id !== id));
      setStats((prev) => ({ ...prev, total: prev.total - 1 }));
    } else {
      alert("삭제에 실패했어요. 다시 시도해주세요.");
    }
    setDeletingId(null);
  }

  async function deleteComment(id: string) {
    if (!confirm("이 댓글을 삭제할까요?")) return;
    setDeletingCommentId(id);
    const res = await adminFetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
      setStats((prev) => ({ ...prev, totalComments: Math.max(0, prev.totalComments - 1) }));
    } else {
      alert("댓글 삭제에 실패했어요. 다시 시도해주세요.");
    }
    setDeletingCommentId(null);
  }

  async function updateReportStatus(id: string, status: "resolved" | "dismissed") {
    setResolvingReportId(id);
    const res = await adminFetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } else {
      alert("상태 변경에 실패했어요.");
    }
    setResolvingReportId(null);
  }

  // ─── 필터 ─────────────────────────────────────────────
  const hustleIds = ["all", ...Array.from(new Set(reviews.map((r) => r.hustle_id)))];
  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.nickname.toLowerCase().includes(q) ||
      r.hustle_name.toLowerCase().includes(q);
    return matchSearch && (filterHustle === "all" || r.hustle_id === filterHustle);
  });
  const filteredComments = commentSearch
    ? comments.filter(
        (c) =>
          c.nickname.toLowerCase().includes(commentSearch.toLowerCase()) ||
          c.content.toLowerCase().includes(commentSearch.toLowerCase())
      )
    : comments;
  const filteredReports = reportSearch
    ? reports.filter(
        (r) =>
          r.reason.toLowerCase().includes(reportSearch.toLowerCase()) ||
          r.type.includes(reportSearch.toLowerCase())
      )
    : reports;

  const reviewMap = Object.fromEntries(reviews.map((r) => [r.id, r]));
  const pendingCount = reports.filter((r) => r.status === "pending").length;

  // 이번 주 후기 수
  const weekAgo = Date.now() - 7 * 86400000;
  const thisWeekCount = reviews.filter((r) => new Date(r.created_at).getTime() > weekAgo).length;

  // 부업별 후기 현황 (후기 수 오름차순 정렬 → 부족한 부업 먼저)
  const hustleReviewStats = ALL_HUSTLES
    .filter((h) => !h.isTerminated && !h.id.startsWith("__hp__"))
    .map((h) => {
      const hustleReviews = reviews.filter((r) => r.hustle_id === h.id);
      const avgSat = hustleReviews.length
        ? (hustleReviews.reduce((s, r) => s + r.satisfaction, 0) / hustleReviews.length).toFixed(1)
        : null;
      const latest = hustleReviews[0]?.created_at ?? null;
      return { hustle: h, count: hustleReviews.length, avgSat, latest };
    })
    .sort((a, b) => a.count - b.count);

  // ─── 로그인 화면 ───────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="card p-8 w-full max-w-sm">
          <h1 className="text-xl font-black text-slate-800 mb-6 text-center">🔒 관리자 로그인</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="관리자 비밀번호"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:border-indigo-400"
            />
            <button
              type="submit"
              disabled={authLoading}
              className="w-full btn-primary py-3 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── 대시보드 ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-black text-sm">N</div>
          <span className="font-bold">관리자 대시보드</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={loadData}
            disabled={loading}
            className="text-slate-400 hover:text-white text-sm transition-colors disabled:opacity-40"
          >
            {loading ? "로딩 중..." : "새로고침"}
          </button>
          <button
            onClick={() => { setAuthed(false); setPw(""); }}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "전체 후기", value: stats.total, icon: "📝", color: "text-slate-800" },
            { label: "이번 주 신규", value: thisWeekCount, icon: "📈", color: "text-indigo-600" },
            {
              label: "신고 대기",
              value: pendingCount,
              icon: "🚨",
              color: pendingCount > 0 ? "text-red-500" : "text-slate-400",
              onClick: pendingCount > 0 ? () => setActiveTab("reports") : undefined,
            },
            { label: "총 클릭", value: totalClicks, icon: "👆", color: "text-green-600" },
          ].map((s) => (
            <div
              key={s.label}
              className={`card p-5 text-center ${s.onClick ? "cursor-pointer hover:border-red-200 transition-colors" : ""}`}
              onClick={s.onClick}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 탭 */}
        <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit flex-wrap">
          {(
            [
              { key: "write", label: "✏️ 후기 등록" },
              { key: "reviews", label: "📝 후기 관리" },
              { key: "comments", label: "💬 댓글 관리" },
              { key: "hustles", label: "📋 부업 현황" },
              { key: "clicks", label: "👆 클릭 통계" },
              { key: "reports", label: "🚨 신고 관리", badge: pendingCount },
            ] as { key: Tab; label: string; badge?: number }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              {tab.badge ? (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* ─── 후기 등록 ─── */}
        {activeTab === "write" && (
          <QuickWriteTab adminFetch={adminFetch} onSuccess={loadData} />
        )}

        {/* ─── 후기 관리 ─── */}
        {activeTab === "reviews" && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="제목, 닉네임, 부업명 검색..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-indigo-400"
              />
              <select
                value={filterHustle}
                onChange={(e) => setFilterHustle(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-indigo-400"
              >
                {hustleIds.map((id) => (
                  <option key={id} value={id}>
                    {id === "all" ? "전체 부업" : (reviews.find((r) => r.hustle_id === id)?.hustle_name ?? id)}
                  </option>
                ))}
              </select>
            </div>

            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">부업</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">제목</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">닉네임</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">수익</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-semibold">인증</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">날짜</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">불러오는 중...</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">후기가 없어요</td>
                    </tr>
                  ) : (
                    filtered.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                            {r.hustle_name}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-[200px]">
                          <a
                            href={`/review/${r.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-700 hover:text-indigo-600 transition-colors line-clamp-1"
                          >
                            {r.title}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{r.nickname}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                          {INCOME_LABELS[r.income_range]}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.proof_image_url ? (
                            <a
                              href={r.proof_image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline text-xs"
                            >
                              📸
                            </a>
                          ) : (
                            <span className="text-slate-200 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                          {timeAgo(r.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => deleteReview(r.id)}
                            disabled={deletingId === r.id}
                            className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors disabled:opacity-40 whitespace-nowrap"
                          >
                            {deletingId === r.id ? "삭제 중..." : "삭제"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {filtered.length > 0 && (
                <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
                  총 {filtered.length}개 후기
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── 댓글 관리 ─── */}
        {activeTab === "comments" && (
          <>
            <input
              type="text"
              value={commentSearch}
              onChange={(e) => setCommentSearch(e.target.value)}
              placeholder="닉네임, 내용 검색..."
              className="w-full sm:w-96 border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-indigo-400 mb-5"
            />
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">닉네임</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">댓글 내용</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">후기</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">날짜</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">불러오는 중...</td></tr>
                  ) : filteredComments.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">댓글이 없어요</td></tr>
                  ) : (
                    filteredComments.map((c) => {
                      const rev = reviewMap[c.review_id];
                      return (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                            {c.nickname}
                            {c.kakao_user_id && (
                              <span className="ml-1.5 text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-semibold">K</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-600 max-w-xs">
                            <span className="line-clamp-2">{c.content}</span>
                          </td>
                          <td className="px-4 py-3">
                            {rev ? (
                              <a
                                href={`/review/${rev.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-600 hover:underline line-clamp-1 max-w-[160px] block"
                              >
                                {rev.title}
                              </a>
                            ) : (
                              <span className="text-xs text-slate-300">삭제된 후기</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{timeAgo(c.created_at)}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteComment(c.id)}
                              disabled={deletingCommentId === c.id}
                              className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors disabled:opacity-40"
                            >
                              {deletingCommentId === c.id ? "삭제 중..." : "삭제"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              {filteredComments.length > 0 && (
                <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
                  총 {filteredComments.length}개 댓글
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── 클릭 통계 ─── */}
        {/* ─── 부업별 현황 ─── */}
        {activeTab === "hustles" && (
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">📋 부업별 후기 현황</h3>
              <span className="text-xs text-slate-400">후기 적은 순 정렬 — 시딩 우선순위 파악용</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold">부업명</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold w-20">후기 수</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold w-20">평균 ★</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold">최근 후기</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold w-16">바로가기</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">불러오는 중...</td></tr>
                ) : (
                  hustleReviewStats.map(({ hustle, count, avgSat, latest }) => (
                    <tr key={hustle.id} className={`hover:bg-slate-50 transition-colors ${count === 0 ? "bg-red-50/40" : count < 5 ? "bg-amber-50/40" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{hustle.emoji}</span>
                          <div>
                            <p className="font-medium text-slate-800">{hustle.name}</p>
                            <p className="text-[11px] text-slate-400">{hustle.category}</p>
                          </div>
                          {count === 0 && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">없음</span>}
                          {count > 0 && count < 5 && <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">부족</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${count === 0 ? "text-red-500" : count < 5 ? "text-amber-600" : "text-slate-700"}`}>
                          {count}개
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {avgSat ? (
                          <span className="flex items-center gap-1">
                            <span className="text-amber-400 text-xs">★</span>
                            <span className="font-medium">{avgSat}</span>
                          </span>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {latest ? timeAgo(latest) : <span className="text-slate-200">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/hustle/${hustle.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-500 hover:underline"
                        >
                          보기 →
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400 flex gap-4">
              <span className="text-red-500">없음 {hustleReviewStats.filter((h) => h.count === 0).length}개</span>
              <span className="text-amber-600">부족(5개 미만) {hustleReviewStats.filter((h) => h.count > 0 && h.count < 5).length}개</span>
              <span className="text-green-600">충분(5개+) {hustleReviewStats.filter((h) => h.count >= 5).length}개</span>
            </div>
          </div>
        )}

        {activeTab === "clicks" && (
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">공식 사이트 클릭 순위</h3>
              <span className="text-xs text-slate-400">클릭 많을수록 제휴 가치 높음</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold w-12">순위</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold">부업명</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold w-20">클릭</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold">비율</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">불러오는 중...</td></tr>
                ) : clickStats.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">클릭 데이터가 없어요</td></tr>
                ) : (
                  clickStats.map((c, i) => {
                    const maxCount = clickStats[0]?.count ?? 1;
                    return (
                      <tr key={c.hustle_name} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-400 font-bold">#{i + 1}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{c.hustle_name}</td>
                        <td className="px-4 py-3 text-indigo-600 font-bold">{c.count}</td>
                        <td className="px-4 py-3 w-40">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-400 rounded-full transition-all"
                              style={{ width: `${(c.count / maxCount) * 100}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── 신고 관리 ─── */}
        {activeTab === "reports" && (
          <>
            <input
              type="text"
              value={reportSearch}
              onChange={(e) => setReportSearch(e.target.value)}
              placeholder="신고 사유 검색..."
              className="w-full sm:w-96 border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-indigo-400 mb-5"
            />
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">상태</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">유형</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">신고 사유</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">대상</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">날짜</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">불러오는 중...</td></tr>
                  ) : filteredReports.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">신고 내역이 없어요</td></tr>
                  ) : (
                    filteredReports.map((rp) => {
                      const rev = rp.type === "review" ? reviewMap[rp.target_id] : null;
                      const cmt = rp.type === "comment" ? comments.find((c) => c.id === rp.target_id) : null;
                      const statusBadge = {
                        pending: { label: "대기", cls: "bg-yellow-100 text-yellow-700" },
                        resolved: { label: "처리됨", cls: "bg-green-100 text-green-700" },
                        dismissed: { label: "기각", cls: "bg-slate-100 text-slate-500" },
                      }[rp.status];
                      return (
                        <tr key={rp.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusBadge.cls}`}>
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${rp.type === "review" ? "bg-indigo-100 text-indigo-700" : "bg-violet-100 text-violet-700"}`}>
                              {rp.type === "review" ? "후기" : "댓글"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-700 max-w-[200px]">
                            <span className="line-clamp-2">{rp.reason}</span>
                          </td>
                          <td className="px-4 py-3">
                            {rev ? (
                              <a href={`/review/${rev.id}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline line-clamp-1 max-w-[150px] block">
                                {rev.title}
                              </a>
                            ) : cmt ? (
                              <span className="text-xs text-slate-600 line-clamp-1 max-w-[150px] block">{cmt.content}</span>
                            ) : (
                              <span className="text-xs text-slate-300">삭제된 콘텐츠</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{timeAgo(rp.created_at)}</td>
                          <td className="px-4 py-3">
                            {rp.status === "pending" && (
                              <div className="flex flex-col gap-1">
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => updateReportStatus(rp.id, "resolved")}
                                    disabled={resolvingReportId === rp.id}
                                    className="text-xs text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-colors disabled:opacity-40 whitespace-nowrap"
                                  >
                                    처리
                                  </button>
                                  <button
                                    onClick={() => updateReportStatus(rp.id, "dismissed")}
                                    disabled={resolvingReportId === rp.id}
                                    className="text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 px-2 py-1 rounded transition-colors disabled:opacity-40 whitespace-nowrap"
                                  >
                                    기각
                                  </button>
                                </div>
                                {/* 신고된 콘텐츠 바로 삭제 */}
                                {(rev ?? cmt) && (
                                  <button
                                    onClick={async () => {
                                      if (!confirm("신고 처리 + 해당 콘텐츠를 삭제할까요?")) return;
                                      if (rp.type === "review" && rev) {
                                        await deleteReview(rev.id);
                                      } else if (rp.type === "comment" && cmt) {
                                        await deleteComment(cmt.id);
                                      }
                                      await updateReportStatus(rp.id, "resolved");
                                    }}
                                    disabled={resolvingReportId === rp.id}
                                    className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors disabled:opacity-40 whitespace-nowrap border border-red-200"
                                  >
                                    처리+삭제
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400 flex gap-4">
                <span>전체 {reports.length}건</span>
                <span className="text-yellow-600">대기 {reports.filter((r) => r.status === "pending").length}건</span>
                <span className="text-green-600">처리됨 {reports.filter((r) => r.status === "resolved").length}건</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

// ─── 후기 빠른 등록 컴포넌트 ────────────────────────────
const INCOME_RANGES = Object.keys(INCOME_LABELS) as IncomeRange[];
const ACTIVE_HUSTLES = ALL_HUSTLES.filter((h) => !h.isTerminated);

function QuickWriteTab({
  adminFetch,
  onSuccess,
}: {
  adminFetch: (path: string, options?: RequestInit) => Promise<Response>;
  onSuccess: () => void;
}) {
  const initForm = () => ({
    hustleId: "",
    nickname: "",
    satisfaction: 5,
    incomeRange: "" as IncomeRange | "",
    difficulty: 3,
    weeklyHours: 5,
    title: "",
    content: "",
    pros: "",
    cons: "",
    recommend: true,
  });

  const [form, setForm] = useState(initForm);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(0);
  const [error, setError] = useState("");

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const selectedHustle = ACTIVE_HUSTLES.find((h) => h.id === form.hustleId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedHustle || !form.incomeRange || !form.content.trim()) {
      setError("부업, 수익, 내용은 필수예요.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await adminFetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          hustle_id: selectedHustle.id,
          hustle_name: selectedHustle.name,
          nickname: form.nickname || "익명",
          satisfaction: form.satisfaction,
          income_range: form.incomeRange,
          difficulty: form.difficulty,
          weekly_hours: form.weeklyHours,
          title: form.title || `${selectedHustle.name} 후기`,
          content: form.content.trim(),
          pros: form.pros.trim(),
          cons: form.cons.trim(),
          recommend: form.recommend,
          proof_image_url: null,
          kakao_user_id: null,
        }),
      });
      if (!res.ok) throw new Error("등록 실패");
      setDone((n) => n + 1);
      setForm(initForm());
      onSuccess();
    } catch {
      setError("등록에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      {done > 0 && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-semibold">
          ✅ 이 세션에서 {done}개 후기를 등록했어요
        </div>
      )}
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {/* 부업 선택 */}
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1.5">부업 선택 *</label>
          <select
            value={form.hustleId}
            onChange={(e) => set("hustleId", e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-indigo-400"
          >
            <option value="">-- 부업을 선택하세요 --</option>
            {ACTIVE_HUSTLES.map((h) => (
              <option key={h.id} value={h.id}>{h.emoji} {h.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 닉네임 */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">닉네임</label>
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => set("nickname", e.target.value)}
              placeholder="익명"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>
          {/* 주 투자시간 */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">주 투자시간(h)</label>
            <input
              type="number"
              value={form.weeklyHours}
              onChange={(e) => set("weeklyHours", Number(e.target.value))}
              min={0} max={80}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 만족도 */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">만족도 (1-5)</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((n) => (
                <button key={n} type="button" onClick={() => set("satisfaction", n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${form.satisfaction >= n ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          {/* 난이도 */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">난이도 (1-5)</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((n) => (
                <button key={n} type="button" onClick={() => set("difficulty", n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${form.difficulty === n ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 수익 범위 */}
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1.5">월 수익 *</label>
          <div className="flex flex-wrap gap-1.5">
            {INCOME_RANGES.map((r) => (
              <button key={r} type="button" onClick={() => set("incomeRange", r)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${form.incomeRange === r ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500 hover:border-indigo-300"}`}>
                {INCOME_LABELS[r]}
              </button>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1.5">제목 (비우면 자동생성)</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder={selectedHustle ? `${selectedHustle.name} 후기` : "제목"}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
          />
        </div>

        {/* 본문 */}
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1.5">후기 본문 *</label>
          <textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            rows={5}
            placeholder="실제 경험 내용을 작성하세요..."
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">장점</label>
            <textarea value={form.pros} onChange={(e) => set("pros", e.target.value)} rows={2}
              placeholder="장점..." className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">단점</label>
            <textarea value={form.cons} onChange={(e) => set("cons", e.target.value)} rows={2}
              placeholder="단점..." className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none" />
          </div>
        </div>

        {/* 추천 */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-600">추천 여부</label>
          <button type="button" onClick={() => set("recommend", !form.recommend)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${form.recommend ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {form.recommend ? "👍 추천" : "👎 비추"}
          </button>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {submitting ? "등록 중..." : "✅ 후기 등록하기"}
        </button>
      </form>
    </div>
  );
}
