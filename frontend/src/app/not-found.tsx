import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="ko">
      <body className="min-h-screen flex items-center justify-center bg-white">
        <main className="text-center p-8">
          <h1 className="text-4xl font-extrabold mb-4">404</h1>
          <p className="text-lg text-gray-600 mb-6">
            요청하신 페이지를 찾을 수 없습니다.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded">
              홈으로 돌아가기
            </Link>
            <Link
              href="/help"
              className="px-4 py-2 border rounded text-gray-700"
            >
              도움말
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
