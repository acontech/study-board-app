"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchPostById, deletePost } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import CommentSection from "@/components/comment/CommentSection";

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(Number(postId)),
    enabled: !!postId, // postId가 있을 때만 쿼리 실행
  });

  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const isAuthor = user && post && user.user_id === post.user_id;

  const handleDelete = async () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        await deletePost(Number(postId));
        alert("게시물이 삭제되었습니다.");
        router.push("/"); // 삭제 후 메인 페이지로 이동
      } catch (error) {
        console.error("게시물 삭제 실패:", error);
        alert("게시물 삭제에 실패했습니다.");
      }
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">게시물 로딩 중...</div>;
  }

  if (isError) {
    return <div className="container mx-auto p-4 text-center text-red-500">게시물을 불러오는 데 실패했습니다.</div>;
  }

  if (!post) {
    return <div className="container mx-auto p-4 text-center">게시물을 찾을 수 없습니다.</div>;
  }

  return (
    <section className="container mx-auto p-4">
      <div className="border rounded-md p-6">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="text-sm text-gray-600 mb-4 flex justify-between items-center">
          <div>
            <span className="mr-4">작성자: {post.author}</span>
            <span className="mr-4">작성일: {post.date}</span>
            <span>조회수: {post.views}</span>
          </div>
          {isAuthor && (
            <div>
              <Link href={`/edit/${post.id}`} className="text-blue-500 hover:underline mr-2">수정</Link>
              <button onClick={handleDelete} className="text-red-500 hover:underline">삭제</button>
            </div>
          )}
        </div>
        <hr className="mb-4" />
        <div className="prose max-w-none mb-6">
          <p>{post.content}</p>
        </div>
        <hr className="mb-4" />
        
        <CommentSection postId={Number(postId)} />
        <div className="flex justify-end mt-6">
          <button
            onClick={() => router.back()}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            목록으로
          </button>
        </div>
      </div>
    </section>
  );
}