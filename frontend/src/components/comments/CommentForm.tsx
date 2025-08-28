'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { API_ROUTES } from '@/lib/routes';
import { Post } from '@/types/post';
import { useRouter } from 'next/navigation';

interface CommentFormProps {
  post: Post;
}

export default function CommentForm({ post }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(API_ROUTES.comments(post.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      setContent('');
      success('댓글이 등록되었습니다.');
      router.refresh(); // 서버 컴포넌트 데이터를 새로고침
    } catch (err) {
      error('댓글 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요..."
        className="w-full p-2 border rounded-md"
        rows={3}
        required
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSubmitting ? '등록 중...' : '등록'}
        </button>
      </div>
    </form>
  );
}
