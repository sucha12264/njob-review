import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { BASE_URL } from "@/lib/constants";

// 홈은 클라이언트 컴포넌트(필터·탭·정렬 상태)라 metadata를 직접 내보낼 수 없어
// 서버 컴포넌트로 한 겹 감싼다. canonical이 빠져 있던 유일한 페이지였다.
export const metadata: Metadata = {
  alternates: { canonical: BASE_URL },
};

export default function Page() {
  return <HomeClient />;
}
