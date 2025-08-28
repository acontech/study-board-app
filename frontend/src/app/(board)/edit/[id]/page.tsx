'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PostForm from '@/components/posts/PostForm';
import { useToast } from '@/hooks/useToast';
import { API_ROUTES, PAGE_ROUTES } from '@/lib/routes';
import { Post } from '@/types/post';

// NOTE: 목업 데이터 (app/(board)/[id]/page.tsx 에 정의된 것과 동일)
const mockPost = {
  id: 1,
  title: '목업 데이터 제목입니다',
  content: '여기는 목업 데이터의 본문입니다. 백엔드 API가 연결되지 않았을 때 표시되는 테스트용 텍스트입니다. 길이를 늘리기 위해 여러 번 반복합니다. 여기는 목업 데이터의 본문입니다. 백엔드 API가 연결되지 않았을 때 표시되는 테스트용 텍스트입니다. 길이를 늘리기 위해 여러 번 반복합니다. 여기는 목업 데이터의 본문입니다. 백엔드 API가 연결되지 않았을 때 표시되는 테스트용 텍스트입니다. 길이를 늘리기 위해 여러 번 반복합니다. \n\n줄바꿈도 잘 되는지 확인합니다.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  author: {
    id: 1,
    email: 'test@example.com',
    nickname: '테스트유저',
    birth_date: '1990-01-01',
  },
  comments: [],
  view_count: 123,
};

export default function EditPostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { success, error } = useToast();

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        /*
        // NOTE: 백엔드 연동 시 아래 주석 해제
        try {
          const response = await fetch(API_ROUTES.post(id as string));
          if (!response.ok) throw new Error('Post not found');
          const data = await response.json();
          setPost(data);
        } catch (err) {
          error('게시물을 불러오는데 실패했습니다.');
          router.push(PAGE_ROUTES.HOME);
        } finally {
          setIsLoading(false);
        }
        */

        // NOTE: 임시 목업 데이터 반환
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log(`Returning mock post for edit id: ${id}`);
        setPost({ ...mockPost, id: parseInt(id as string, 10) });
        setIsLoading(false);
      };
      fetchPost();
    }
  }, [id, router, error]);

  const handleSubmit = async (data: { title: string; content: string }) => {
    if (!id) return;
    setIsSubmitting(true);
    /*
    // NOTE: 백엔드 연동 시 아래 주석 해제
    try {
      const response = await fetch(API_ROUTES.post(id as string), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      success('게시물이 수정되었습니다.');
      router.push(PAGE_ROUTES.post(id as string));
    } catch (err) {
      error('게시물 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
    */

    // NOTE: 임시 목업 게시물 수정 처리
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Mock update post ${id} with:`, data);
    success('게시물이 수정되었습니다.');
    router.push(PAGE_ROUTES.post(id as string));
  };

  if (isLoading) {
    return <div>Loading...</div>; // 또는 스켈레톤 UI
  }

  if (!post) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">게시물 수정</h1>
      <PostForm post={post} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
