import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isIndexableReview,
  reviewTextLength,
  REVIEW_INDEXABLE_CHARS,
} from "../src/lib/reviewQuality";

// 색인 여부가 이 함수 하나로 결정된다(sitemap + robots 공유) — 기준이 흔들리면
// 사이트 품질 평가 전체가 흔들리므로 경계값을 고정해둔다.

test("합계가 기준 이상이면 색인 대상", () => {
  const r = {
    content: "가".repeat(200),
    pros: "나".repeat(60),
    cons: "다".repeat(40),
  };
  assert.equal(reviewTextLength(r), 300);
  assert.equal(isIndexableReview(r), true);
});

test("기준에서 1자 모자라면 제외", () => {
  const r = { content: "가".repeat(REVIEW_INDEXABLE_CHARS - 1), pros: "", cons: "" };
  assert.equal(isIndexableReview(r), false);
});

test("공백은 분량으로 치지 않는다", () => {
  const r = { content: "  실내용  ", pros: " \n ", cons: null };
  assert.equal(reviewTextLength(r), 3);
});

test("null/undefined 필드에도 죽지 않는다", () => {
  assert.equal(isIndexableReview({ content: null, pros: undefined, cons: null }), false);
  assert.equal(isIndexableReview({}), false);
});
