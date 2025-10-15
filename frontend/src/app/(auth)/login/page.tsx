"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(""); // 이메일 유효성 검사 에러 상태 추가

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      authLogin(data.access_token); // AuthContext의 login 함수 호출
    },
    onError: (err: any) => {
      console.error("로그인 실패:", err);
      setError(err.response?.data?.detail || "로그인에 실패했습니다.");
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
      setError(""); // 이전 에러 메시지 초기화
      setEmailError(""); // 이메일 에러 메시지 초기화

      let isValid = true;

      if (!email.trim()) {
        setEmailError("이메일을 입력해주세요.");
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(email)) { // 간단한 이메일 형식 검사
        setEmailError("유효한 이메일 주소를 입력해주세요.");
        isValid = false;
      }

      if (!password.trim()) {
        setError("비밀번호를 입력해주세요.");
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      loginMutation.mutate({ email, password });
    },
    [email, password, loginMutation, authLogin]
  );

  return (
    <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              이메일
            </label>
            <input
              type="email"
              id="email"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${emailError ? "border-red-500" : ""}`}
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <p className="text-red-500 text-xs italic mt-1">{emailError}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "로그인 중..." : "로그인"}
            </button>
          </div>
          <div className="text-center mt-4">
            <Link href="/signup" className="font-bold text-blue-500 hover:text-blue-800">
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}