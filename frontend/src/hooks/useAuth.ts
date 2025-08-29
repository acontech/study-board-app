import useSWR from "swr";
import { API_ROUTES } from "@/lib/routes";
import fetcher from "@/lib/api";
import { User } from "@/types/auth";

// Next.js에서 **양쪽 환경(서버/클라이언트)**에서 동일한 코드로 쿠키를 다룰 수 있는 라이브러리
import { getCookie } from "cookies-next";

const mockUser: User = {
  id: 1,
  email: "test@example.com",
  nickname: "테스트유저",
  birth_date: "1990-01-01",
};

export function useAuth() {
  /*
  // FIXME: 백엔드 연동 시 아래 주석 해제
  const { data, error, isLoading, mutate } = useSWR<User | null>(
    API_ROUTES.ME,
    fetcher,
    {
      shouldRetryOnError: false, // 401 등의 에러 시 재시도 방지
    }
  );
  */

  // REVIEW: useSWR 은 데이터 패칭 처리와 캐싱 기능을 가지고 있다.
  //  mutate() 함수 호출을 통해서 캐시를 갱신하는 등의 기능을 실행 할 수 있다.

  /*
  | `data`      | 요청 성공 시 응답 데이터 | 화면에 보여줄 실제 데이터   |
  | `error`     | 요청 실패 시 에러 객체   | 에러 메시지/리다이렉트 처리  |
  | `isLoading` | 요청 중 여부            | 로딩 스피너/대기 UI     |
  | `mutate`    | 캐시 갱신 및 재검증 함수 | 낙관적 업데이트, 강제 최신화 |

  */
  const { data, error, isLoading, mutate } = useSWR<User | null>(
    API_ROUTES.ME, // 키는 유지하여 다른 곳에서 mutate 호출 시 재검증 유도
    () => {
      // 실제 fetch 대신 쿠키 유무에 따라 목업 데이터 반환
      const token = getCookie("access_token");
      return token ? mockUser : null;
    },
    {
      // 오류 발생시 재시도 하지 않도록 설정.
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
