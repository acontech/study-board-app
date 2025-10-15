"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signupUser, checkEmailDuplication } from "@/lib/api";
import ConfirmModal from "@/components/popup/confirm";

interface ModalContent {
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function SignupPage() {
  const router = useRouter();

  const [birthdate, setBirthdate] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [birthdateError, setBirthdateError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const openModal = useCallback((content: ModalContent) => {
    setModalContent(content);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
  }, []);

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      alert("회원가입이 성공적으로 완료되었습니다. 로그인 해주세요.");
      router.push("/login");
    },
    onError: (error: any) => {
      console.error("회원가입 실패:", error);
      alert(`회원가입에 실패했습니다: ${error.response?.data?.detail || error.message}`);
    },
    onSettled: () => {
      closeModal();
    },
  });

  const emailCheckMutation = useMutation({
    mutationFn: checkEmailDuplication,
    onSuccess: (data) => {
      if (data.exists) {
        setEmailError("이미 사용 중인 이메일입니다.");
        setIsEmailAvailable(false);
      } else {
        setEmailError("");
        setIsEmailAvailable(true);
        alert("사용 가능한 이메일입니다.");
      }
      setIsEmailChecked(true);
    },
    onError: (error: any) => {
      console.error("이메일 중복 확인 실패:", error);
      setEmailError(`이메일 중복 확인에 실패했습니다: ${error.response?.data?.detail || error.message}`);
      setIsEmailChecked(false);
      setIsEmailAvailable(false);
    },
  });

  const validateForm = useCallback(() => {
    let isValid = true;

    // 생년월일 유효성 검사 (yyyy-mm-dd 형식)
    const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthdate.trim()) {
      setBirthdateError("생년월일을 입력해주세요.");
      isValid = false;
    } else if (!birthdateRegex.test(birthdate)) {
      setBirthdateError("생년월일 형식이 올바르지 않습니다 (yyyy-mm-dd).");
      isValid = false;
    } else {
      setBirthdateError("");
    }

    // 닉네임 유효성 검사
    if (!nickname.trim()) {
      setNicknameError("닉네임을 입력해주세요.");
      isValid = false;
    } else {
      setNicknameError("");
    }

    // 이메일 유효성 검사
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email.trim()) {
      setEmailError("이메일을 입력해주세요.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("유효한 이메일 주소를 입력해주세요.");
      isValid = false;
    } else if (!isEmailChecked || !isEmailAvailable) {
      setEmailError("이메일 중복 확인이 필요합니다.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // 비밀번호 유효성 검사 (최소 8자, 영문, 숫자, 특수문자 포함)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!password.trim()) {
      setPasswordError("비밀번호를 입력해주세요.");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError("비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // 비밀번호 확인 유효성 검사
    if (!confirmPassword.trim()) {
      setConfirmPasswordError("비밀번호 확인을 입력해주세요.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  }, [birthdate, nickname, email, password, confirmPassword, isEmailChecked, isEmailAvailable]);

  const handleSignupConfirm = useCallback(() => {
    if (validateForm()) {
      signupMutation.mutate({
        birthdate,
        nickname,
        email,
        password,
      });
    } else {
      closeModal(); // 유효성 검사 실패 시 모달 닫기
    }
  }, [validateForm, birthdate, nickname, email, password, signupMutation, closeModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      openModal({
        message: "회원가입을 하시겠습니까?",
        onConfirm: handleSignupConfirm,
        confirmText: "가입",
        cancelText: "취소",
      });
    }
  };

  const handleEmailCheck = () => {
    if (!email.trim()) {
      setEmailError("이메일을 입력해주세요.");
      return;
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setEmailError("유효한 이메일 주소를 입력해주세요.");
      return;
    }
    setIsEmailChecked(false); // 중복 확인 다시 시작
    setIsEmailAvailable(false);
    emailCheckMutation.mutate(email);
  };

  // 이메일 변경 시 중복 확인 상태 초기화
  useEffect(() => {
    setIsEmailChecked(false);
    setIsEmailAvailable(false);
    setEmailError("");
  }, [email]);

  return (
    <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="birthdate" className="block text-gray-700 text-sm font-bold mb-2">
              생년월일(yyyy-mm-dd)
            </label>
            <input
              type="text"
              id="birthdate"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${birthdateError ? "border-red-500" : ""}`}
              placeholder="yyyy-mm-dd"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
            {birthdateError && <p className="text-red-500 text-xs italic mt-1">{birthdateError}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="nickname" className="block text-gray-700 text-sm font-bold mb-2">
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${nicknameError ? "border-red-500" : ""}`}
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            {nicknameError && <p className="text-red-500 text-xs italic mt-1">{nicknameError}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              이메일
            </label>
            <div className="flex">
              <input
                type="email"
                id="email"
                className={`shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${emailError ? "border-red-500" : ""}`}
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="button"
                onClick={handleEmailCheck}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
                disabled={emailCheckMutation.isPending}
              >
                {emailCheckMutation.isPending ? "확인 중..." : "중복확인"}
              </button>
            </div>
            {emailError && <p className="text-red-500 text-xs italic mt-1">{emailError}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${passwordError ? "border-red-500" : ""}`}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="text-red-500 text-xs italic mt-1">{passwordError}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${confirmPasswordError ? "border-red-500" : ""}`}
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && <p className="text-red-500 text-xs italic mt-1">{confirmPasswordError}</p>}
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={signupMutation.isPending || emailCheckMutation.isPending}
            >
              {signupMutation.isPending ? "가입 중..." : "회원가입"}
            </button>
          </div>
        </form>
      </div>

      {isModalOpen && modalContent && (
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={modalContent.onConfirm}
          message={modalContent.message}
          confirmText={modalContent.confirmText}
          cancelText={modalContent.cancelText}
        />
      )}
    </main>
  );
}