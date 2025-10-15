"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ConfirmModal from "@/components/popup/confirm";

interface ModalContent {
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function NewPostPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      alert("로그인이 필요합니다.");
      router.replace("/login");
    }
  }, [isLoggedIn, isAuthLoading, router]);

  const openModal = useCallback((content: ModalContent) => {
    setModalContent(content);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
  }, []);

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // 게시물 목록 캐시 무효화
      alert("게시물이 성공적으로 등록되었습니다.");
      router.push("/"); // 목록 페이지로 이동
    },
    onError: (error) => {
      console.error("게시물 등록 실패:", error);
      alert("게시물 등록에 실패했습니다.");
    },
    onSettled: () => {
      closeModal(); // 모달 닫기
    },
  });

  const handleCreateConfirm = useCallback(() => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      closeModal();
      return;
    }
    createPostMutation.mutate({ title, content });
  }, [title, content, createPostMutation, closeModal]);

  const handleCancelConfirm = useCallback(() => {
    router.back(); // 목록 페이지로 이동
    closeModal();
  }, [router, closeModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openModal({
      message: "게시물을 등록하시겠습니까?",
      onConfirm: handleCreateConfirm,
      confirmText: "등록",
      cancelText: "취소",
    });
  };

  if (isAuthLoading) {
    return <div className="container mx-auto p-4 text-center">로그인 상태 확인 중...</div>;
  }

  if (!isLoggedIn) {
    return null; // useEffect에서 리다이렉트 처리하므로 여기서는 아무것도 렌더링하지 않음
  }

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">새 게시물 작성</h1>
      <form onSubmit={handleSubmit} className="border rounded-md p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            제목
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
            내용
          </label>
          <textarea
            id="content"
            rows={10}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              openModal({
                message: "게시물 작성을 취소하시겠습니까?",
                onConfirm: handleCancelConfirm,
                confirmText: "예",
                cancelText: "아니오",
              })
            }
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            disabled={createPostMutation.isPending}
          >
            취소
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={createPostMutation.isPending}
          >
            {createPostMutation.isPending ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>

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
    </section>
  );
}