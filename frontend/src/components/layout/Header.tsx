'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { API_ROUTES, PAGE_ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, mutate } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch(API_ROUTES.LOGOUT, { method: 'POST' });
      mutate(null); // 로컬 상태 업데이트
      router.push(PAGE_ROUTES.HOME);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={PAGE_ROUTES.HOME} className="text-2xl font-bold text-gray-800">
          업무_게시판
        </Link>
        <nav>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{user.nickname}님</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href={PAGE_ROUTES.LOGIN}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}