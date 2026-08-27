/** 사이트 전역 상수 — 도메인 변경 시 여기만 수정 */
export const BASE_URL = "https://njob-review.vercel.app";

/**
 * 정적 콘텐츠(부업 데이터·가이드·비교)의 마지막 실제 수정일.
 * sitemap의 lastmod에 쓰인다. new Date()를 쓰면 매 요청마다 "방금 바뀜"이라고
 * 거짓 신고하게 되어 검색엔진이 lastmod 자체를 무시한다.
 * → hustleData/hustleGuides/comparePairs를 고칠 때 이 날짜를 함께 올릴 것.
 */
export const STATIC_CONTENT_UPDATED = new Date("2026-08-27T00:00:00Z");

/** 날짜 → "방금 / N분 전 / N시간 전 / N일 전 / N개월 전" */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1)  return "방금";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d}일 전`;
  if (d < 30) return `${Math.floor(d / 7)}주 전`;
  return `${Math.floor(d / 30)}개월 전`;
}
