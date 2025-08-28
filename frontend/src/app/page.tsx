import PostList from "@/components/posts/PostList";
import { getPosts } from "@/lib/api/posts";
import { getCurrentUser } from "@/lib/auth";
import { PAGE_ROUTES } from "@/lib/routes";
import { User } from "@/types/auth";
import { PostListItem } from "@/types/post";
import { ApiError } from "@/lib/error/api-error";
import Link from "next/link";

export default async function HomePage() {
  // IDEA: getPosts() 는 예외를 throw 하기 때문에 이곳에서 try-catch로 처리 해야함.
  let posts: PostListItem[] = [];
  let user: User | null = null;
  let errorMessage = null;

  try {
    posts = await getPosts();
    user = await getCurrentUser();
  } catch (error: unknown) {
    // IDEA: 호출자는 예외 타입에 따른 UI 처리를 한다.
    if (ApiError.isApiError(error)) {
      // 사용자에게 노출되는 메세지
      errorMessage = "데이터를 불러오는 중에 오류가 발생했습니다.";

      //개발자용 로그
      console.log("API Error occurred:", error.toJSON());
    } else if (error instanceof Error) {
      errorMessage = "알 수 없는 오류가 발생했습니다.";
      console.log("Unexpected Error:", error);
    }
  }

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
      {errorMessage ? (
        <div className="text-red-500 mb-4">{errorMessage}</div>
      ) : posts.length === 0 ? (
        <div className="text-gray-500 mb-4">게시물이 없습니다.</div>
      ) : (
        <PostList posts={posts} />
      )}
      {/* 페이지네이션 컴포넌트 추가 위치 */}
    </div>
  );
}
