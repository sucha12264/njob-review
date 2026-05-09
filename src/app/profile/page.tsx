import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "내 후기 | N잡 후기판",
  description: "내가 작성한 부업 후기와 수익 업데이트 현황을 확인하세요.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
