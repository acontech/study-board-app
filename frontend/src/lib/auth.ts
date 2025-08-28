import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { API_ROUTES } from "./routes";
import { Session, User } from "@/types/auth";

const mockUser: User = {
  id: 1,
  email: "test@example.com",
  nickname: "테스트유저",
  birth_date: "1990-01-01",
};

// 서버 컴포넌트 또는 API 라우트에서 사용
export async function getCurrentUser(): Promise<User | null> {
  /*
  // NOTE: 백엔드 연동 시 아래 주석 해제
  const cookieStore = cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${process.env.API_URL}${API_ROUTES.ME}`,
     {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store', // 중요: 사용자 정보는 캐시하지 않음
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return null;
  }
  */
  // NOTE: 임시 목업 데이터 반환
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  return token ? mockUser : null;
}

// 미들웨어에서 사용
export async function getSession(req: NextRequest): Promise<Session | null> {
  /*
  // NOTE: 백엔드 연동 시 아래 주석 해제
  const token = req.cookies.get('access_token')?.value;

  if (!token) {
    return { user: null };
  }

  try {
    const response = await fetch(`${process.env.API_URL}${API_ROUTES.ME}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        cookie: req.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      return { user: null };
    }

    const user = await response.json();
    return { user, accessToken: token };
  } catch (error) {
    return { user: null };
  }
  */
  // NOTE: 임시 목업 데이터 반환
  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    return { user: null };
  }
  return { user: mockUser, accessToken: token };
}
