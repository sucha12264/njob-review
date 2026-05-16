/**
 * 부업별 쿠팡 관련 용품 링크
 * 이 링크는 쿠팡 파트너스 활동의 일환으로, 수수료를 제공받을 수 있습니다.
 */

export interface AffiliateProduct {
  name: string;
  emoji: string;
  link: string;
}

const MIC:      AffiliateProduct = { name: "콘덴서 마이크",       emoji: "🎙️", link: "https://link.coupang.com/a/dNlbA4nj64" };
const LIGHT:    AffiliateProduct = { name: "링라이트 조명",        emoji: "💡", link: "https://link.coupang.com/a/dNluzrLuVg" };
const BAG:      AffiliateProduct = { name: "배달 가방",            emoji: "🎒", link: "https://link.coupang.com/a/dNlsounrk4" };
const KEYBOARD: AffiliateProduct = { name: "무선 키보드·마우스",   emoji: "⌨️", link: "https://link.coupang.com/a/dNlpYimjpA" };
const CAMERA:   AffiliateProduct = { name: "미러리스 카메라",      emoji: "📷", link: "https://link.coupang.com/a/dNlnirr59o" };
const BATTERY:  AffiliateProduct = { name: "보조배터리",           emoji: "🔋", link: "https://link.coupang.com/a/dNlhSIwNUq" };

export const HUSTLE_PRODUCTS: Record<string, AffiliateProduct[]> = {
  // 영상·SNS
  "youtube":            [MIC, LIGHT],
  "youtube-shorts":     [MIC, LIGHT],
  "tiktok":             [MIC, LIGHT],
  "instagram-sponsor":  [LIGHT, CAMERA],
  "naver-influencer":   [CAMERA, LIGHT],
  "stock-photo":        [CAMERA, LIGHT],

  // 블로그·글쓰기
  "naver-blog":    [KEYBOARD],
  "tistory":       [KEYBOARD],
  "brunch":        [KEYBOARD],
  "newsletter":    [KEYBOARD],

  // 배달·서비스
  "baemin-rider":  [BAG],
  "coupang-flex":  [BAG],

  // 앱테크·설문
  "cashslide":     [BATTERY],
  "panel-now":     [BATTERY],
  "toss-benefit":  [BATTERY],
  "app-testing":   [BATTERY],
  "data-labeling": [KEYBOARD],
};
