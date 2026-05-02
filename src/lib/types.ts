export type IncomeRange =
  | "under_10"
  | "10_to_30"
  | "30_to_50"
  | "50_to_100"
  | "over_100";

export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type Satisfaction = 1 | 2 | 3 | 4 | 5;

export interface Review {
  id: string;
  created_at: string;
  nickname: string;
  hustle_id: string;       // 구체적인 부업 ID (ex: "coupang-partners", "esim-palee")
  hustle_name: string;     // 표시 이름 (ex: "쿠팡파트너스", "E심팔이")
  income_range: IncomeRange;
  weekly_hours: number;
  difficulty: Difficulty;
  satisfaction: Satisfaction;
  title: string;
  content: string;
  pros: string;
  cons: string;
  recommend: boolean;
  likes: number;
  proof_image_url?: string | null;
  kakao_user_id?: string | null;
}

export interface ReviewInput {
  nickname: string;
  hustle_id: string;
  hustle_name: string;
  income_range: IncomeRange;
  weekly_hours: number;
  difficulty: Difficulty;
  satisfaction: Satisfaction;
  title: string;
  content: string;
  pros: string;
  cons: string;
  recommend: boolean;
  proof_image_url?: string | null;
}

export const INCOME_LABELS: Record<IncomeRange, string> = {
  under_10: "10만원 미만",
  "10_to_30": "10~30만원",
  "30_to_50": "30~50만원",
  "50_to_100": "50~100만원",
  over_100: "100만원 이상",
};

export const INCOME_COLORS: Record<IncomeRange, string> = {
  under_10: "bg-slate-100 text-slate-600",
  "10_to_30": "bg-blue-100 text-blue-700",
  "30_to_50": "bg-green-100 text-green-700",
  "50_to_100": "bg-amber-100 text-amber-700",
  over_100: "bg-purple-100 text-purple-700",
};

// ─── 자유게시판 ────────────────────────────────────────
export type BoardCategory = "자유수다" | "수익인증" | "질문해요" | "정보공유" | "N잡시작";

export const BOARD_CATEGORIES: BoardCategory[] = [
  "자유수다", "수익인증", "질문해요", "정보공유", "N잡시작",
];

export const BOARD_CATEGORY_COLORS: Record<BoardCategory, string> = {
  "자유수다":  "bg-slate-100 text-slate-600",
  "수익인증":  "bg-green-100 text-green-700",
  "질문해요":  "bg-blue-100 text-blue-700",
  "정보공유":  "bg-amber-100 text-amber-700",
  "N잡시작":   "bg-purple-100 text-purple-700",
};

export const BOARD_CATEGORY_EMOJI: Record<BoardCategory, string> = {
  "자유수다":  "💬",
  "수익인증":  "💰",
  "질문해요":  "❓",
  "정보공유":  "📢",
  "N잡시작":   "🚀",
};

export interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  nickname: string;
  kakao_user_id?: string | null;
  category: BoardCategory;
  likes: number;
  views: number;
  comment_count: number;
}

export interface PostComment {
  id: string;
  post_id: string;
  created_at: string;
  nickname: string;
  kakao_user_id?: string | null;
  content: string;
}
