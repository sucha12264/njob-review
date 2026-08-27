/**
 * API 라우트에 대한 요청이 우리 사이트 페이지에서 출발한 것인지 판별한다.
 *
 * 기존 미들웨어 로직은 `!origin && !!host`를 same-origin으로 간주했다.
 * 브라우저가 same-origin GET에 Origin을 생략한다는 점을 노린 것이었지만,
 * Origin을 아예 보내지 않는 모든 비브라우저 클라이언트(curl, 스크립트, 스크래퍼)도
 * 똑같이 통과했기 때문에 사실상 아무것도 막지 못했다.
 *
 * 또 Referer를 `referer.includes(host)`로 검사해서
 * `https://evil.com/njob-review.vercel.app` 같은 URL에도 통과했다.
 */

/** origin/referer 문자열의 host가 우리 host와 정확히 일치하는지 (부분 문자열 매칭 금지) */
function hostMatches(value: string, host: string): boolean {
  try {
    return new URL(value).host === host;
  } catch {
    return false;
  }
}

export interface ApiRequestHeaders {
  origin: string;
  referer: string;
  host: string;
  secFetchSite: string;
}

export function isSameOriginApiRequest(h: ApiRequestHeaders): boolean {
  if (!h.host) return false;

  // 로컬 개발은 그대로 허용
  if (h.host.startsWith("localhost") || h.host.startsWith("127.0.0.1")) return true;

  // 1순위: Sec-Fetch-Site. 브라우저가 직접 붙이고 스크립트로 위조할 수 없는 헤더라
  //        판별 근거로 가장 신뢰도가 높다. (fetch/XHR은 same-origin이면 항상 "same-origin")
  if (h.secFetchSite) return h.secFetchSite === "same-origin";

  // 2순위: Sec-Fetch-Site를 안 보내는 구형 브라우저(Safari 16.4 미만 등) 폴백.
  if (h.origin) return hostMatches(h.origin, h.host);
  if (h.referer) return hostMatches(h.referer, h.host);

  // 셋 다 없으면 브라우저에서 온 요청으로 볼 근거가 없다.
  return false;
}
