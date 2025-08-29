"use client";

import React, { createContext, useState } from "react";

// NOTE: 전역 관리를 위한 토큰 타입 정의
interface AuthContextType {
  accessToken: string | null;

  // NOTE: set 으로 시작하는 업데이트 함수는 2가지 방식으로 값을 변경 할 수 있다.
  //  첫번째가 아래와 같이 직접 값을 넣는 방식.
  setAccessToken: (accessToken: string | null) => void;
  //  두번째가 아래와 같이 업데이트 함수를 사용하는 방식.
  //   setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
}

// NOTE: 전역 관리를 위한 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// NOTE: 컨텍스트 제공을 위한 프로바이더 생성
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// NOTE: 컨텍스트 사용을 위한 커스텀 훅 정의
export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
