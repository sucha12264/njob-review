"use client";

import { useState, useEffect, useCallback } from "react";
import type { Review } from "@/lib/types";
import { INCOME_LABELS } from "@/lib/types";

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

interface Summary {
  hustle_id: string;
  hustle_name: string;
  verdict: "긍정적" | "중립" | "부정적";
  summary: string;
  pros: string[];
  cons: string[];
  best_for: string;
  review_count: number;
  updated_at: string;
}

type Tab = "reviews" | "comments" | "clicks" | "reports" | "summaries";

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
  const [reports, setReports] = useState<Report[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0, withProof: 0, totalComments: 0 });
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("reviews");
  const [search, setSearch] = useState("");
  const [commentSearch, setCommentSearch] = useState("");
  const [reportSearch, setReportSearch] = useState("");
  const [summarySearch, setSummarySearch] = useState("");
  const [filterHustle, setFilterHustle] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [resolvingReportId, setResolvingReportId] = useState<string | null>(null);
  const [deletingSummaryId, setDeletingSummaryId] = useState<string | null>(null);

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
      const [revRes, cmmRes, clkRes, rptRes, sumRes] = await Promise.all([
        adminFetch("/api/admin/reviews"),
        adminFetch("/api/admin/comments"),
        adminFetch("/api/admin/clicks"),
        adminFetch("/api/admin/reports"),
        adminFetch("/api/admin/summaries"),
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
        const { stats: cls } = await clkRes.json() as { stats: { hustle_name: string; count: number }[] };
        setClickStats(cls);
      }
      if (rptRes.ok) {
        const { reports: rpt } = await rptRes.json() as { reports: Report[] };
        setReports(rpt);
      }
      if (sumRes.ok) {
        const { summaries: sum } = await sumRes.json() as { summaries: Summary[] };
        setSummaries(sum);
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
    }
    setDeletingCommentId(null);
  }

  async function updateReportStatus(id: string, status: "resolved" | "dismissed") {
    setResolvingReportId(id);
    const res = await adminFetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (res.ok) setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setResolvingReportId(null);
  }

  async function deleteSummary(hustleId: string) {
    if (!confirm("이 AI 요약 캐시를 삭제할까요?")) return;
    setDeletingSummaryId(hustleId);
    const res = await adminFetch(`/api/admin/summaries/${hustleId}`, { method: "DELETE" });
    if (res.ok) setSummaries((prev) => prev.filter((s) => s.hustle_id !== hustleId));
    setDeletingSummaryId(null);
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
  const filteredSummaries = summarySearch
    ? summaries.filter(
        (s) =>
          s.hustle_name.toLowerCase().includes(summarySearch.toLowerCase()) ||
          s.verdict.includes(summarySearch)
      )
    : summaries;

  const reviewMap = Object.fromEntries(reviews.map((r) => [r.id, r]));
  const pendingCount = reports.filter((r) => r.status === "pending").length;

  const verdictBadge = {
    긍정적: "bg-green-100 text-green-700",
    중립: "bg-amber-100 text-amber-700",
    부정적: "bg-red-100 text-red-700",
  };

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
            { label: "오늘 등록", value: stats.today, icon: "🆕", color: "text-indigo-600" },
            { label: "수익 인증", value: stats.withProof, icon: "📸", color: "text-green-600" },
            { label: "전체 댓글", value: stats.totalComments, icon: "💬", color: "text-violet-600" },
          ].map((s) => (
            <div key={s.label} className="card p-5 text-center">
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
              { key: "reviews", label: "📝 후기 관리" },
              { key: "comments", label: "💬 댓글 관리" },
              { key: "clicks", label: "📊 클릭 통계" },
              { key: "reports", label: "🚨 신고 관리", badge: pendingCount },
              { key: "summaries", label: "🤖 AI 요약" },
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

        {/* ─── AI 요약 관리 ─── */}
        {activeTab === "summaries" && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <input
                type="text"
                value={summarySearch}
                onChange={(e) => setSummarySearch(e.target.value)}
                placeholder="부업명, 판정 검색..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-indigo-400"
              />
              <div className="text-xs text-slate-400 whitespace-nowrap">
                캐시 {summaries.length}개 / 전체 63개
              </div>
            </div>

            {/* 캐시 커버리지 바 */}
            <div className="card p-4 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">캐시 커버리지</span>
                <span className="text-sm font-bold text-indigo-600">{Math.round((summaries.length / 63) * 100)}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${(summaries.length / 63) * 100}%` }}
                />
              </div>
              <div className="flex gap-4 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                  긍정적 {summaries.filter((s) => s.verdict === "긍정적").length}개
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  중립 {summaries.filter((s) => s.verdict === "중립").length}개
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                  부정적 {summaries.filter((s) => s.verdict === "부정적").length}개
                </span>
              </div>
            </div>

            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">부업명</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">판정</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">요약</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">기반 후기</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">업데이트</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">불러오는 중...</td></tr>
                  ) : filteredSummaries.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">캐시된 요약이 없어요</td></tr>
                  ) : (
                    filteredSummaries.map((s) => (
                      <tr key={s.hustle_id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">
                          <a
                            href={`/hustle/${s.hustle_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-600 transition-colors"
                          >
                            {s.hustle_name}
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${verdictBadge[s.verdict]}`}>
                            {s.verdict}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs max-w-[280px]">
                          <span className="line-clamp-2">{s.summary}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs text-center">
                          {s.review_count}개
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                          {timeAgo(s.updated_at)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => deleteSummary(s.hustle_id)}
                            disabled={deletingSummaryId === s.hustle_id}
                            className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors disabled:opacity-40"
                          >
                            {deletingSummaryId === s.hustle_id ? "삭제 중..." : "캐시 삭제"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {filteredSummaries.length > 0 && (
                <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
                  총 {filteredSummaries.length}개 요약 캐시
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
