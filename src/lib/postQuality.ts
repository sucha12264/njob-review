/**
 * 게시판 글 색인 기준 — 후기(reviewQuality.ts)와 같은 원리.
 *
 * /board/[id]는 robots 설정이 없어 한 줄짜리 글도 색인 대상이었다.
 * 짧은 글이 대량으로 색인 후보에 오르면 사이트 전체가 저품질로 평가되므로,
 * 기준 미달 글은 noindex + 사이트맵 제외하고 목록 페이지(/board)에서만 노출한다.
 */

/** 게시글이 단독 페이지로 색인될 최소 텍스트량 (제목+본문 합계) */
export const POST_INDEXABLE_CHARS = 300;

export interface PostText {
  title?: string | null;
  content?: string | null;
}

/** 이 게시글이 단독 페이지로 색인될 만한 분량인가 */
export function isIndexablePost(p: PostText): boolean {
  return (
    (p.title ?? "").trim().length + (p.content ?? "").trim().length >=
    POST_INDEXABLE_CHARS
  );
}
