import { notFound } from "next/navigation";
import { formatDate } from "@/utils/format";
import { getCurrentUser } from "@/lib/auth";
import CommentList from "@/components/comments/CommentList";
import CommentForm from "@/components/comments/CommentForm";
import Link from "next/link";
import { getPost, getComments } from "@/lib/api/posts";

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const post = await getPost(id);
  const comments = await getComments(id);
  const user = await getCurrentUser();

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="bg-white p-6 rounded-lg shadow-md">
        <header className="border-b pb-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <div>
              <span>{post.author.nickname}</span>
              <span className="mx-2">·</span>
              <span>{formatDate(post.created_at)}</span>
              <span className="mx-2">·</span>
              <span>조회수 {post.view_count}</span>
            </div>
            {user?.id === post.author.id && (
              <div className="flex gap-4">
                <Link
                  href={`/edit/${post.id}`}
                  className="text-blue-600 hover:underline"
                >
                  수정
                </Link>
                {/* 삭제 버튼은 클라이언트 컴포넌트에서 처리 필요 */}
              </div>
            )}
          </div>
        </header>

        <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      <section className="mt-8">
        {user ? (
          <CommentForm post={post} />
        ) : (
          <div className="text-center p-4 border rounded-md bg-gray-100">
            <Link href="/login" className="text-blue-600 font-semibold">
              댓글을 작성하려면 로그인하세요.
            </Link>
          </div>
        )}
        <CommentList post={post} comments={comments} currentUser={user} />
      </section>
    </div>
  );
}
