"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // jwt-decode 라이브러리 임포트

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean; // 인증 상태 로딩 중인지 여부
  user: UserPayload | null;
  login: (token: string) => void;
  logout: () => void;
}

interface UserPayload {
  email: string;
  user_id: number;
  nickname: string;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태
  const [user, setUser] = useState<UserPayload | null>(null);

  // 토큰 유효성 검사 및 사용자 정보 설정
  const checkToken = useCallback(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode<UserPayload>(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          // 토큰 유효
          setIsLoggedIn(true);
          setUser(decoded);
        } else {
          // 토큰 만료
          localStorage.removeItem("access_token");
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
    setIsLoading(false); // 토큰 확인 완료
  }, []);

  useEffect(() => {
    checkToken();
    // 페이지 로드 시 토큰 확인
    // 탭/창 포커스 시 토큰 재확인 (선택 사항, 최신 상태 유지를 위해)
    window.addEventListener("focus", checkToken);
    return () => {
      window.removeEventListener("focus", checkToken);
    };
  }, [checkToken]);

  const login = useCallback((token: string) => {
    localStorage.setItem("access_token", token);
    checkToken(); // 로그인 후 토큰 확인 및 상태 업데이트
    router.push("/"); // 로그인 성공 후 메인 페이지로 이동
  }, [checkToken, router]);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/login"); // 로그아웃 후 로그인 페이지로 이동
  }, [router]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}