import type { Metadata } from "next";
import BoardWriteClient from "./BoardWriteClient";

export const metadata: Metadata = {
  title: "게시글 작성 | 자유게시판",
  description: "N잡 후기판 자유게시판에 글을 작성하세요.",
  robots: { index: false, follow: false },
};

export default function BoardWritePage() {
  return <BoardWriteClient />;
}
