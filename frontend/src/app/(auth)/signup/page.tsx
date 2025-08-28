'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/useToast';
import { API_ROUTES, PAGE_ROUTES } from '@/lib/routes';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    birth_date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      error('비밀번호가 일치하지 않습니다.');
      return;
    }
    setIsSubmitting(true);

    /*
    // NOTE: 백엔드 연동 시 아래 주석 해제
    try {
      const response = await fetch(API_ROUTES.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname,
          birth_date: formData.birth_date,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Signup failed');
      }

      success('회원가입이 완료되었습니다. 로그인해주세요.');
      router.push(PAGE_ROUTES.LOGIN);
    } catch (err: any) {
      error(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
    */

    // NOTE: 임시 목업 회원가입 처리
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Mock signup with:', formData);
    success('회원가입이 완료되었습니다. 로그인해주세요.');
    router.push(PAGE_ROUTES.LOGIN);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">회원가입</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className='block text-sm font-medium text-gray-700'>생년월일</label>
            <input name='birth_date' type='date' onChange={handleChange} required className='w-full px-3 py-2 mt-1 border rounded-md' />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>닉네임</label>
            <input name='nickname' type='text' onChange={handleChange} required className='w-full px-3 py-2 mt-1 border rounded-md' />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>이메일</label>
            <input name='email' type='email' onChange={handleChange} required className='w-full px-3 py-2 mt-1 border rounded-md' />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>비밀번호</label>
            <input name='password' type='password' onChange={handleChange} required className='w-full px-3 py-2 mt-1 border rounded-md' />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>비밀번호 확인</label>
            <input name='passwordConfirm' type='password' onChange={handleChange} required className='w-full px-3 py-2 mt-1 border rounded-md' />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
            {isSubmitting ? '가입 중...' : '회원가입 완료'}
          </button>
          <p className="text-sm text-center text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link href={PAGE_ROUTES.LOGIN} className="font-medium text-blue-600 hover:underline">
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
