import type { Metadata } from "next";
import Link from "next/link";

// CHECK : vs code 에서 .css 파일 자동완성 기능을 사용하려면?
import "./globals.css";

import Header from "@/components/layout/Header";

// CHECK : metadata 를 작성하는 이유는?
export const metadata: Metadata = {
  title: "업무 게시판",
  description: "Next.js + FastAPI 스터디",
};

export default function RootLayout({
  children,
}: Readonly<{
  // CHECK : Readonly 의 사용목적은?
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto p-4">{children}</main>
        <footer className="text-center p-4 bg-gray-100 text-gray-500 text-sm">
          © 2025 업무_게시판
        </footer>
      </body>
    </html>
  );
}
