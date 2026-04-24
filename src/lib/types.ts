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
