import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

// REVIEW: 토스트 메세지를 사용하기 위한 라이브러리 추가
import { AppToaster } from "@/hooks/useToast";

// NOTE: 토큰 값을 전역으로 사용하기 위한 프로바이더 추가
import { AuthProvider } from "./(auth)/login/test/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "업무 게시판",
  description: "Acontech study board app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <AuthProvider>
        <body className={inter.className}>
          {/* REVIEW : 일반적으로 최상위 레이아웃에 한번 포함해서 사용한다.
            그리고 클라이언트 컴포넌트에서만 동작한다.(DOM 접근이 필요하기 때문에)*/}
          <AppToaster />

          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <footer className="bg-gray-100 text-center py-4 text-sm text-gray-500">
              © 2025 업무_게시판
            </footer>
          </div>
        </body>
      </AuthProvider>
    </html>
  );
}
