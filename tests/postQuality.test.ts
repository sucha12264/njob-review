import { test } from "node:test";
import assert from "node:assert/strict";
import { isIndexablePost, POST_INDEXABLE_CHARS } from "../src/lib/postQuality";

test("제목+본문 합계가 기준 이상이면 색인 대상", () => {
  const p = { title: "가".repeat(50), content: "나".repeat(POST_INDEXABLE_CHARS - 50) };
  assert.equal(isIndexablePost(p), true);
});

test("기준 미달 게시글은 제외", () => {
  assert.equal(isIndexablePost({ title: "짧은 글", content: "한 줄짜리 내용" }), false);
});

test("null 필드에도 죽지 않는다", () => {
  assert.equal(isIndexablePost({ title: null, content: null }), false);
  assert.equal(isIndexablePost({}), false);
});
