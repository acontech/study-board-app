import { getCookie } from "cookies-next";

const getApiUrl = () => {
  if (typeof window === "undefined") {
    // 서버 사이드
    return process.env.API_URL || "http://localhost:8000";
  }
  // 클라이언트 사이드
  return process.env.NEXT_PUBLIC_API_URL || "";
};

const API_URL = getApiUrl();

interface FeatchError extends Error {
  info?: unknown;
  status?: number;
}

// REVIEW: options 는 fetch() 의 두번째 인자와 동일
//  현재 fetcher() 함수는 SWR 전용으로 사용하기 때문에 GET 요청만 처리한다.
async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // 클라이언트 사이드에서 실행될 때만 쿠키를 헤더에 추가
  if (typeof window !== "undefined") {
    const token = getCookie("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // 기본값은 options. 이후 headers 로 덮어씀.
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: FeatchError = new Error(
      "An error occurred while fetching the data."
    );
    error.info = errorData;
    error.status = response.status;
    throw error;
  }

  // 내용이 없는 응답 처리 (e.g., 204 No Content)
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

export default fetcher;
