import React, { useState, useEffect } from 'react';
import { CommentResponse, updateComment, deleteComment } from '@/lib/api';
import { createComment, getCommentsByPostId } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface CommentSectionProps {
  postId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await getCommentsByPostId(postId);
      setComments(fetchedComments);
    } catch (err) {
      setError('댓글을 불러오는 데 실패했습니다.');
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!newCommentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert('로그인 토큰이 없습니다.');
        return;
      }
      await createComment(postId, newCommentContent, token);
      setNewCommentContent('');
      fetchComments(); // 댓글 작성 후 목록 새로고침
    } catch (err) {
      setError('댓글 작성에 실패했습니다.');
      console.error('Failed to create comment:', err);
    }
  };

  const handleEditClick = (comment: CommentResponse) => {
    setEditingCommentId(comment.comment_id);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!editingContent.trim()) {
      alert('수정할 댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert('로그인 토큰이 없습니다.');
        return;
      }
      await updateComment(commentId, editingContent, token);
      setEditingCommentId(null);
      setEditingContent('');
      fetchComments(); // 댓글 수정 후 목록 새로고침
    } catch (err) {
      setError('댓글 수정에 실패했습니다.');
      console.error('Failed to update comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert('로그인 토큰이 없습니다.');
        return;
      }
      await deleteComment(commentId, token);
      fetchComments(); // 댓글 삭제 후 목록 새로고침
    } catch (err) {
      setError('댓글 삭제에 실패했습니다.');
      console.error('Failed to delete comment:', err);
    }
  };

  if (loading) return <p>댓글 로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">댓글</h2>
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p>아직 댓글이 없습니다.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.comment_id} className="border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{comment.author}</span>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">{new Date(comment.created_at).toLocaleString()}</span>
                  {user && user.user_id === comment.user_id && (
                    <>
                      {editingCommentId === comment.comment_id ? (
                        <button
                          onClick={() => handleUpdateComment(comment.comment_id)}
                          className="text-green-500 hover:underline ml-2"
                        >
                          저장
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(comment)}
                          className="text-blue-500 hover:underline ml-2"
                        >
                          수정
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteComment(comment.comment_id)}
                        className="text-red-500 hover:underline ml-2"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </div>
              {editingCommentId === comment.comment_id ? (
                <textarea
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                ></textarea>
              ) : (
                <p>{comment.content}</p>
              )}
            </div>
          ))
        )}
      </div>

      {user && (
        <form onSubmit={handleCommentSubmit} className="mt-6">
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="댓글을 작성해주세요..."
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="mt-3 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            댓글 작성
          </button>
        </form>
      )}
      {!user && (
        <p className="mt-6 text-gray-600">댓글을 작성하려면 로그인해주세요.</p>
      )}
    </div>
  );
};

export default CommentSection;