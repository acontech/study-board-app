'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { API_ROUTES, PAGE_ROUTES } from '@/lib/routes';
import { setCookie } from 'cookies-next';

export default function LoginPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();
  const { mutate } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    /*
    // NOTE: 백엔드 연동 시 아래 주석 해제
    try {
      const response = await fetch(API_ROUTES.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      // BFF API가 httpOnly 쿠키를 설정해줌
      await mutate(); // useAuth 훅의 상태를 재검증하여 사용자 정보를 가져옴
      success('로그인되었습니다.');
      router.push(PAGE_ROUTES.HOME);

    } catch (err) {
      error('이메일 또는 비밀번호가 일치하지 않습니다.');
    } finally {
      setIsSubmitting(false);
    }
    */

    // NOTE: 임시 목업 로그인 처리
    await new Promise(resolve => setTimeout(resolve, 500)); // 가짜 로딩
    if (email === 'test@example.com' && password === 'password123') {
      setCookie('access_token', 'mock-jwt-token-string', {
        maxAge: 60 * 60 * 24, // 1 day
      });
      await mutate();
      success('로그인되었습니다.');
      router.push(PAGE_ROUTES.HOME);
    } else {
      error('이메일 또는 비밀번호가 일치하지 않습니다.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">로그인</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </div>
          <p className="text-sm text-center text-gray-600">
            계정이 없으신가요?{' '}
            <Link href={PAGE_ROUTES.SIGNUP} className="font-medium text-blue-600 hover:underline">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
