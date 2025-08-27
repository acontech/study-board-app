import type { Metadata } from "next";
import Link from "next/link";

// CHECK : vs code 에서 .css 파일 자동완성 기능을 사용하려면?
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import Loading from "./loading";

// CHECK : metadata 를 작성하는 이유는?
export const metadata: Metadata = {
  title: "업무 게시판",
  description: "Next.js + FastAPI 스터디",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col text-gray-900">
        {/* 헤더와 푸터를 별도 서버 컴포넌트로 작성함. */}
        <Header />

        <Suspense fallback={<Loading />}>
          <main className="flex-1 container mx-auto p-4">{children}</main>
        </Suspense>

        <Footer />
      </body>
    </html>
  );
}
