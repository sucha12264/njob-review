import { test } from "node:test";
import assert from "node:assert/strict";
import { isSameOriginApiRequest } from "../src/lib/apiOrigin";

const HOST = "njob-review.vercel.app";
const base = { origin: "", referer: "", host: HOST, secFetchSite: "" };

// 모든 API 라우트 앞단(src/proxy.ts)이 이 함수로 외부 접근을 거른다.
// 여기가 뚫리면 스팸 봇이 후기/댓글 API를 직접 때릴 수 있다.

test("Sec-Fetch-Site: same-origin이면 허용", () => {
  assert.equal(isSameOriginApiRequest({ ...base, secFetchSite: "same-origin" }), true);
});

test("Sec-Fetch-Site: cross-site면 origin이 그럴듯해도 차단", () => {
  assert.equal(
    isSameOriginApiRequest({ ...base, secFetchSite: "cross-site", origin: `https://${HOST}` }),
    false
  );
});

test("폴백: origin host 정확 일치만 허용 (부분 문자열 공격 차단)", () => {
  assert.equal(isSameOriginApiRequest({ ...base, origin: `https://${HOST}` }), true);
  assert.equal(isSameOriginApiRequest({ ...base, origin: `https://evil.com/${HOST}` }), false);
  assert.equal(isSameOriginApiRequest({ ...base, referer: `https://evil.com/?x=${HOST}` }), false);
});

test("판별 근거가 하나도 없으면 차단 (curl 등 비브라우저)", () => {
  assert.equal(isSameOriginApiRequest(base), false);
});

test("로컬 개발은 허용", () => {
  assert.equal(isSameOriginApiRequest({ ...base, host: "localhost:3000" }), true);
});
