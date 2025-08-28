import { API_ROUTES, PAGE_ROUTES } from "@/lib/routes";
import PostList from "@/components/posts/PostList";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getPosts } from "@/lib/api/posts";
import { notFound } from "next/navigation";

export default async function HomePage() {
  const posts = await getPosts();
  const user = await getCurrentUser();

  if (!posts) {
    notFound();
  }

  // TODO : 게시물 조회는 성공했지만 실제 건수가 0건인 경우 예외 처리 필요.
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">게시물 목록</h1>
        {user && (
          <Link
            href={PAGE_ROUTES.POST_NEW}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            글쓰기
          </Link>
        )}
      </div>
      <PostList posts={posts} />
      {/* 페이지네이션 컴포넌트 추가 위치 */}
    </div>
  );
}
