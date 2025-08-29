import { API_ROUTES } from "@/lib/routes";
import { User } from "@/types/auth";
import useSWR from "swr";

// Next.js에서 **양쪽 환경(서버/클라이언트)**에서 동일한 코드로 쿠키를 다룰 수 있는 라이브러리
import { getCookie } from "cookies-next";
import { useAuthContext } from "@/app/(auth)/login/test/AuthContext";

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

  // swr 이 호출되면 전역 캐시 저장소가 생성되고, 이 저장소에 key 별로 데이터가 저장된다.
  // 기본적으로 전역 캐시 저장소는 1개 이기 때문에 다수의 함수에서 swr 을 사용하더라도
  // 동일한 key 를 사용하면 같은 데이터를 공유하게 된다.

  // key 값은 배열 형태로 지정 할 수 있는데 [key1, key2] 와 같은 형식을 권장한다.
  //  key 값은 swr 내부에서 JSON.stringify 처리한 값으로 관리되기 되기 때문에
  //  key 값이 객체이거나 배열인 경우 주의가 필요하다.

  // 만약 페이지 별로 별도의 캐시 저장소를 사용하고 싶다면 SWRConfig 컴포넌트의
  // Provider 를 사용하여 별도의 캐시 저장소를 생성할 수 있다.
  // 이 경우에는 동일한 key 를 사용하더라도 서로 다른 데이터를 가지게 된다.

  // 필요하다면 전역 캐시 저장소에 직접 접근도 가능하다.(권장하지는 않음)
  //  예를 들어 로그아웃 할때 캐시 저장소를 초기화 하는 등의 작업이 필요한 경우 사용가능.

  /*
  | `data`      | 요청 성공 시 응답 데이터 | 화면에 보여줄 실제 데이터   |
  | `error`     | 요청 실패 시 에러 객체   | 에러 메시지/리다이렉트 처리  |
  | `isLoading` | 요청 중 여부            | 로딩 스피너/대기 UI     |
  | `mutate`    | 캐시 갱신 및 재검증 함수 | 낙관적 업데이트, 강제 최신화 |

  */

  // NOTE: 컨텍스트를 통해 저장된 액세스 토큰 값
  const { accessToken } = useAuthContext();

  const { data, error, isLoading, mutate } = useSWR<User | null>(
    API_ROUTES.ME,
    () => {
      const token = accessToken;
      return token ? mockUser : null;
    },
    {
      // 오류 발생시 재시도 하지 않도록 설정.
      shouldRetryOnError: false,
    }
  );

  return {
    data,
    error,
    isLoading,
    isLoggedIn: !!data,
    mutate,
  };
}
