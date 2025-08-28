import useSWR from 'swr';
import { API_ROUTES } from '@/lib/routes';
import fetcher from '@/lib/api';
import { User } from '@/types/auth';
import { getCookie } from 'cookies-next';

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  nickname: '테스트유저',
  birth_date: '1990-01-01',
};

export function useAuth() {
  /*
  // NOTE: 백엔드 연동 시 아래 주석 해제
  const { data, error, isLoading, mutate } = useSWR<User | null>(
    API_ROUTES.ME,
    fetcher,
    {
      shouldRetryOnError: false, // 401 등의 에러 시 재시도 방지
    }
  );
  */

  // NOTE: 임시 목업 데이터 사용
  const { data, error, isLoading, mutate } = useSWR<User | null>(
    API_ROUTES.ME, // 키는 유지하여 다른 곳에서 mutate 호출 시 재검증 유도
    () => {
      // 실제 fetch 대신 쿠키 유무에 따라 목업 데이터 반환
      const token = getCookie('access_token');
      return token ? mockUser : null;
    },
    {
      shouldRetryOnError: false,
    }
  );


  return {
    user: data,
    error,
    isLoading,
    isLoggedIn: !!data,
    mutate,
  };
}
