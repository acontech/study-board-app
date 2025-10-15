"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { AuthProvider } from "../context/AuthContext";

export default function Providers({ children }: { children: ReactNode }) {
  // React Query에서 전역 캐시, 쿼리 상태를 관리하려면 QueryClient가 필요
  // useState를 사용하면 컴포넌트가 재렌더링될 때도 새로운 인스턴스가 생기지 않음
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}> {/*앱 전체에서 React Query의 캐싱, fetch, 상태 관리를 사용 가능하게 함*/}
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}