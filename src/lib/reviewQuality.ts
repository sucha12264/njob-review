/**
 * 후기 분량 기준 — 작성 폼, 서버 검증, 색인 판단이 모두 이 파일을 공유한다.
 *
 * 배경: 기존 최소 기준이 20자였고 본문 질문이 "자유롭게 써주세요" 하나뿐이라
 * 실제 후기 576건의 content 중앙값이 85자, 최대 205자에 그쳤다.
 * 그 결과 /review/[id]는 단독 페이지로 색인될 수 없는 얇은 콘텐츠가 됐다.
 */

/** 후기 본문 최소 길이. 이 미만이면 저장 자체를 거부한다. */
export const REVIEW_MIN_CONTENT = 100;

/**
 * 후기 상세 페이지를 색인 대상으로 볼 최소 텍스트량 (본문+장점+단점 합계).
 * 이 기준을 넘긴 후기만 sitemap에 들어가고 robots에 index가 붙는다.
 * 분량이 곧 품질은 아니지만, 이보다 짧으면 검색엔진이 색인해주지 않는다.
 */
export const REVIEW_INDEXABLE_CHARS = 300;

export interface ReviewText {
  content?: string | null;
  pros?: string | null;
  cons?: string | null;
}

/** 후기가 담고 있는 실제 텍스트 총량 */
export function reviewTextLength(r: ReviewText): number {
  return (
    (r.content ?? "").trim().length +
    (r.pros ?? "").trim().length +
    (r.cons ?? "").trim().length
  );
}

/** 이 후기가 단독 페이지로 색인될 만한 분량인가 */
export function isIndexableReview(r: ReviewText): boolean {
  return reviewTextLength(r) >= REVIEW_INDEXABLE_CHARS;
}
