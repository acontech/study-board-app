"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPostById, updatePost } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ConfirmModal from "@/components/popup/confirm";

interface ModalContent {
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;
  const queryClient = useQueryClient();
  const { user, isLoggedIn, isLoading: isAuthLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const { data: post, isLoading: isPostLoading, isError: isPostError } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(Number(postId)),
    enabled: !!postId,
  });

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      alert("로그인이 필요합니다.");
      router.replace("/login");
    }
  }, [isLoggedIn, isAuthLoading, router]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      // 게시물 작성자와 현재 로그인된 사용자가 다르면 접근 제한
      if (user && user.user_id !== post.user_id) {
        alert("게시물 수정 권한이 없습니다.");
        router.replace(`/${postId}`);
      }
    }
  }, [post, user, router, postId]);

  if (isPostLoading || isAuthLoading) {
    return <div className="container mx-auto p-4 text-center">로딩 중...</div>;
  }

  if (isPostError || !post) {
    return <div className="container mx-auto p-4 text-center text-red-500">게시물을 불러오는 데 실패했거나 찾을 수 없습니다.</div>;
  }

  if (!isLoggedIn || (user && user.user_id !== post.user_id)) {
    return null; // 권한 없는 사용자는 useEffect에서 리다이렉트 처리
  }

  const openModal = useCallback((content: ModalContent) => {
    setModalContent(content);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
  }, []);

  const updatePostMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { title: string; content: string } }) =>
      updatePost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] }); // 상세 게시물 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // 게시물 목록 캐시 무효화
      alert("게시물이 성공적으로 수정되었습니다.");
      router.push(`/${postId}`); // 상세 페이지로 이동
    },
    onError: (error) => {
      console.error("게시물 수정 실패:", error);
      alert("게시물 수정에 실패했습니다.");
    },
    onSettled: () => {
      closeModal(); // 모달 닫기
    },
  });

  const handleUpdateConfirm = useCallback(() => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      closeModal();
      return;
    }
    updatePostMutation.mutate({ id: Number(postId), payload: { title, content } });
  }, [title, content, updatePostMutation, closeModal, postId]);

  const handleCancelConfirm = useCallback(() => {
    router.back(); // 이전 페이지로 이동
    closeModal();
  }, [router, closeModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openModal({
      message: "게시물을 수정하시겠습니까?",
      onConfirm: handleUpdateConfirm,
      confirmText: "수정",
      cancelText: "취소",
    });
  };

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">게시물 수정</h1>
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
                message: "게시물 수정을 취소하시겠습니까?",
                onConfirm: handleCancelConfirm,
                confirmText: "예",
                cancelText: "아니오",
              })
            }
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            disabled={updatePostMutation.isPending}
          >
            취소
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={updatePostMutation.isPending}
          >
            {updatePostMutation.isPending ? "수정 중..." : "수정"}
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
