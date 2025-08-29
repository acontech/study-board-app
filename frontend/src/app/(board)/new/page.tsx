"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostForm from "@/components/posts/PostForm";
import { useToast } from "@/hooks/useToast";
import { API_ROUTES, PAGE_ROUTES } from "@/lib/routes";

export default function NewPostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();

  const handleSubmit = async (data: { title: string; content: string }) => {
    setIsSubmitting(true);
    /*
    // NOFIXMETE: 백엔드 연동 시 아래 주석 해제
    try {
      const response = await fetch(API_ROUTES.POSTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      success('게시물이 등록되었습니다.');
      router.push(PAGE_ROUTES.post(newPost.id));
    } catch (err) {
      error('게시물 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
    */

    // FIXME: 임시 목업 게시물 생성 처리
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Mock create post with:", data);
    const newMockId = Math.floor(Math.random() * 1000) + 100; // 임의의 새 ID
    success("게시물이 등록되었습니다.");
    router.push(PAGE_ROUTES.post(newMockId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">게시물 작성</h1>
      <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
