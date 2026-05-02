import type { Metadata } from "next";
import BoardClient from "./BoardClient";

export const metadata: Metadata = {
  title: "자유게시판 | N잡 후기판",
  description:
    "N잡러들의 자유로운 수다. 수익 인증, 질문, 정보 공유, 시작 후기를 나눠보세요.",
  alternates: { canonical: "https://njob-review.vercel.app/board" },
  openGraph: {
    title: "자유게시판 | N잡 후기판",
    description: "N잡러들의 자유로운 수다. 수익 인증, 질문, 정보 공유, 시작 후기를 나눠보세요.",
    url: "https://njob-review.vercel.app/board",
    siteName: "N잡 후기판",
    locale: "ko_KR",
    type: "website",
  },
};

export default function BoardPage() {
  return <BoardClient />;
}
