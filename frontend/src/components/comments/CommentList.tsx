'use client';

import { useState } from 'react';
import { Comment, Post } from '@/types/post';
import { User } from '@/types/auth';
import { formatDate } from '@/utils/format';
import { API_ROUTES } from '@/lib/routes';
import { useToast } from '@/hooks/useToast';

interface CommentListProps {
  post: Post;
  comments: Comment[];
  currentUser: User | null;
}

export default function CommentList({ post, comments: initialComments, currentUser }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const { success, error } = useToast();

  const handleDelete = async (commentId: number) => {
    if (!confirm('정말 삭제하시겠습니까? 복구할 수 없습니다.')) return;

    try {
      const response = await fetch(API_ROUTES.comment(post.id, commentId), { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      setComments(comments.filter((c) => c.id !== commentId));
      success('댓글이 삭제되었습니다.');
    } catch (err) {
      error('댓글 삭제에 실패했습니다.');
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent('');
  };

  const handleUpdate = async (commentId: number) => {
    try {
      const response = await fetch(API_ROUTES.comment(post.id, commentId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedContent }),
      });
      if (!response.ok) throw new Error('Failed to update');
      const updatedComment = await response.json();
      setComments(comments.map((c) => (c.id === commentId ? updatedComment : c)));
      success('댓글이 수정되었습니다.');
      handleCancelEdit();
    } catch (err) {
      error('댓글 수정에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-semibold">댓글 ({comments.length}개)</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="p-4 border rounded-md bg-gray-50">
          {editingCommentId === comment.id ? (
            <div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={handleCancelEdit} className="text-sm text-gray-600">취소</button>
                <button onClick={() => handleUpdate(comment.id)} className="text-sm text-blue-600 font-semibold">저장</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-800">{comment.content}</p>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>{comment.author.nickname} · {formatDate(comment.created_at, 'yyyy-MM-dd HH:mm')}</span>
                {currentUser?.id === comment.author.id && (
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(comment)} className="hover:text-blue-600">수정</button>
                    <button onClick={() => handleDelete(comment.id)} className="hover:text-red-600">삭제</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
