import { getCookie } from 'cookies-next';

const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // 서버 사이드
    return process.env.API_URL || 'http://localhost:8000';
  } 
  // 클라이언트 사이드
  return process.env.NEXT_PUBLIC_API_URL || '';
};

const API_URL = getApiUrl();

async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 클라이언트 사이드에서 실행될 때만 쿠키를 헤더에 추가
  if (typeof window !== 'undefined') {
    const token = getCookie('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error('An error occurred while fetching the data.') as any;
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
