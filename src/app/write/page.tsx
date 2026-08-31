import type { Metadata } from "next";
import WriteClient from "./WriteClient";
import { BASE_URL } from "@/lib/constants";

// /write?hustle=…&name=… 조합마다 URL이 생겨 GSC에 "표준 없는 중복 페이지"로 잡혔다.
// 작성 폼은 색인 가치가 없으므로 noindex + 파라미터 없는 canonical로 정리한다.
export const metadata: Metadata = {
  title: "후기 작성",
  description: "부업 후기를 작성해 다른 사람들과 경험을 나눠보세요.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${BASE_URL}/write` },
};

export default function WritePage() {
  return <WriteClient />;
}
