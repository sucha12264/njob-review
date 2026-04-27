"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Review } from "@/lib/types";
import { INCOME_LABELS } from "@/lib/types";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "njob-admin-2026";

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

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "오늘";
  if (days < 7) return `${days}일 전`;
  return `${Math.floor(days / 7)}주 전`;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [commentSearch, setCommentSearch] = useState("");
  const [filterHustle, setFilterHustle] = useState("all");
  const [stats, setStats] = useState({ total: 0, today: 0, withProof: 0, totalComments: 0 });
  const [clickStats, setClickStats] = useState<{ hustle_name: string; count: number }[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportSearch, setReportSearch] = useState("");
  const [resolvingReportId, setResolvingReportId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"reviews" | "comments" | "clicks" | "reports">("reviews");

  useEffect(() => {
    if (authed) loadData();
  }, [authed]);

  async function loadData() {
    setLoading(true);

    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      const all = data as Review[];
      setReviews(all);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 댓글 수 가져오기
      const { count: commentCount } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true });

      setStats({
        total: all.length,
        today: all.filter((r) => new Date(r.created_at) >= today).length,
        withProof: all.filter((r) => r.proof_image_url).length,
        totalComments: commentCount ?? 0,
      });
    }

    // 댓글 목록 로드
    const { data: commentData } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });
    if (commentData) setComments(commentData as Comment[]);

    const { data: clicks } = await supabase.from("click_events").select("hustle_name");
    if (clicks) {
      const counts: Record<string, number> = {};
      (clicks as { hustle_name: string }[]).forEach((c) => {
        counts[c.hustle_name] = (counts[c.hustle_name] ?? 0) + 1;
      });
      setClickStats(
        Object.entries(counts)
          .map(([hustle_name, count]) => ({ hustle_name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20)
      );
    }

    const { data: reportData } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });
    if (reportData) setReports(reportData as Report[]);

    setLoading(false);
  }

  async function updateReportStatus(id: string, status: "resolved" | "dismissed") {
    setResolvingReportId(id);
    await supabase.from("reports").update({ status }).eq("id", id);
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setResolvingReportId(null);
  }

  async function deleteReview(id: string) {
    if (!confirm("이 후기를 삭제할까요? 되돌릴 수 없습니다.")) return;
    setDeletingId(id);
    await supabase.from("comments").delete().eq("review_id", id);
    await supabase.from("reviews").delete().eq("id", id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setComments((prev) => prev.filter((c) => c.review_id !== id));
    setDeletingId(null);
  }

  async function deleteComment(id: string) {
    if (!confirm("이 댓글을 삭제할까요?")) return;
    setDeletingCommentId(id);
    await supabase.from("comments").delete().eq("id", id);
    setComments((prev) => prev.filter((c) => c.id !== id));
    setStats((prev) => ({ ...prev, totalComments: Math.max(0, prev.totalComments - 1) }));
    setDeletingCommentId(null);
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="card p-8 w-full max-w-sm">
          <h1 className="text-xl font-black text-slate-800 mb-6 text-center">🔒 관리자 로그인</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pw === ADMIN_PASSWORD) setAuthed(true);
              else alert("비밀번호가 틀렸어요.");
            }}
          >
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="관리자 비밀번호"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:border-indigo-400"
            />
            <button type="submit" className="w-full btn-primary py-3">
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  const hustleIds = ["all", ...Array.from(new Set(reviews.map((r) => r.hustle_id)))];
  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.nickname.toLowerCase().includes(q) ||
      r.hustle_name.toLowerCase().includes(q);
    const matchHustle = filterHustle === "all" || r.hustle_id === filterHustle;
    return matchSearch && matchHustle;
  });

  const filteredComments = comments.filter((c) => {
    const q = commentSearch.toLowerCase();
    if (!q) return true;
    return (
      c.nickname.toLowerCase().includes(q) ||
      c.content.toLowerCase().includes(q)
    );
  });

  // review_id → hustle_name 맵
  const reviewMap = Object.fromEntries(reviews.map((r) => [r.id, r]));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-black text-sm">N</div>
          <span className="font-bold">관리자 대시보드</span>
        </div>
        <button onClick={() => setAuthed(false)} className="text-slate-400 hover:text-white text-sm transition-colors">
          로그아웃
        </button>
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
          {(["reviews", "comments", "clicks", "reports"] as const).map((tab) => {
            const pendingCount = tab === "reports" ? reports.filter((r) => r.status === "pending").length : 0;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === tab ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab === "reviews" && "📝 후기 관리"}
                {tab === "comments" && "💬 댓글 관리"}
                {tab === "clicks" && "📊 클릭 통계"}
                {tab === "reports" && (
                  <>
                    🚨 신고 관리
                    {pendingCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {pendingCount}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* 신고 관리 */}
        {activeTab === "reports" && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input
                type="text"
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
                placeholder="신고 사유, 닉네임 검색..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-indigo-400"
              />
              <button onClick={loadData} className="btn-primary px-5 py-2.5 text-sm">
                새로고침
              </button>
            </div>

            {loading ? (
              <div className="card p-12 text-center text-slate-400">불러오는 중...</div>
            ) : (
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
                    {reports
                      .filter((r) => {
                        const q = reportSearch.toLowerCase();
                        if (!q) return true;
                        return r.reason.toLowerCase().includes(q) || r.type.includes(q);
                      })
                      .length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                          신고 내역이 없어요
                        </td>
                      </tr>
                    ) : (
                      reports
                        .filter((r) => {
                          const q = reportSearch.toLowerCase();
                          if (!q) return true;
                          return r.reason.toLowerCase().includes(q) || r.type.includes(q);
                        })
                        .map((rp) => {
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
                              <td className="px-4 py-3 text-slate-700 max-w-xs">
                                <span className="line-clamp-2">{rp.reason}</span>
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
                                ) : cmt ? (
                                  <span className="text-xs text-slate-600 line-clamp-1 max-w-[160px] block">
                                    {cmt.content}
                                  </span>
                                ) : (
                                  <span className="text-xs text-slate-300">삭제된 콘텐츠</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                                {timeAgo(rp.created_at)}
                              </td>
                              <td className="px-4 py-3">
                                {rp.status === "pending" && (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => updateReportStatus(rp.id, "resolved")}
                                      disabled={resolvingReportId === rp.id}
                                      className="text-xs text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-colors disabled:opacity-40"
                                    >
                                      처리
                                    </button>
                                    <button
                                      onClick={() => updateReportStatus(rp.id, "dismissed")}
                                      disabled={resolvingReportId === rp.id}
                                      className="text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 px-2 py-1 rounded transition-colors disabled:opacity-40"
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
            )}
          </>
        )}

        {/* 클릭 통계 */}
        {activeTab === "clicks" && (
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">공식 사이트 클릭 순위</h3>
              <span className="text-xs text-slate-400">클릭 많을수록 제휴 가치 높음</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold">순위</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold">부업명</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold">클릭 수</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold">비율</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {clickStats.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                      클릭 데이터가 없어요
                    </td>
                  </tr>
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
                              className="h-full bg-indigo-400 rounded-full"
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

        {/* 댓글 관리 */}
        {activeTab === "comments" && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input
                type="text"
                value={commentSearch}
                onChange={(e) => setCommentSearch(e.target.value)}
                placeholder="닉네임, 내용 검색..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-indigo-400"
              />
              <button onClick={loadData} className="btn-primary px-5 py-2.5 text-sm">
                새로고침
              </button>
            </div>

            {loading ? (
              <div className="card p-12 text-center text-slate-400">불러오는 중...</div>
            ) : (
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
                    {filteredComments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                          댓글이 없어요
                        </td>
                      </tr>
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
            )}
          </>
        )}

        {/* 후기 관리 */}
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
              <button onClick={loadData} className="btn-primary px-5 py-2.5 text-sm">
                새로고침
              </button>
            </div>

            {loading ? (
              <div className="card p-12 text-center text-slate-400">불러오는 중...</div>
            ) : (
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-slate-500 font-semibold">부업</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-semibold">제목</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-semibold">닉네임</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-semibold">수익</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-semibold">인증</th>
                      <th className="text-left px-4 py-3 text-slate-500 font-semibold">날짜</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                          후기가 없어요
                        </td>
                      </tr>
                    ) : (
                      filtered.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                              {r.hustle_name}
                            </span>
                          </td>
                          <td className="px-4 py-3 max-w-[220px]">
                            <a
                              href={`/review/${r.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-700 hover:text-indigo-600 transition-colors line-clamp-1"
                            >
                              {r.title}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{r.nickname}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{INCOME_LABELS[r.income_range]}</td>
                          <td className="px-4 py-3 text-center">
                            {r.proof_image_url ? (
                              <a
                                href={r.proof_image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline text-xs"
                              >
                                📸 보기
                              </a>
                            ) : (
                              <span className="text-slate-300 text-xs">없음</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs">{timeAgo(r.created_at)}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteReview(r.id)}
                              disabled={deletingId === r.id}
                              className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors disabled:opacity-40"
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
