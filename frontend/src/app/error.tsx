"use client";

import React from "react";
import Link from "next/link";

type Props = {
  error: Error;
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  // dev 환경에서는 에러 로깅
  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  return (
    <html lang="ko">
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        <main className="max-w-lg w-full p-6 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-2">문제가 발생했습니다</h1>
          <p className="text-sm text-gray-600 mb-4">
            예기치 못한 오류가 발생했습니다. 아래 버튼을 눌러 다시 시도해
            주세요.
          </p>

          <pre className="text-xs text-left bg-gray-100 p-3 rounded mb-4 overflow-auto">
            {process.env.NODE_ENV !== "production"
              ? error.message
              : "서버 오류가 발생했습니다."}
          </pre>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              다시 시도
            </button>
            <Link href="/" className="px-4 py-2 border rounded text-gray-700">
              홈으로
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
