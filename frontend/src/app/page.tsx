"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, fetchTotalPostsCount } from "@/lib/api";
import { ITEMS_PER_PAGE, calculatePaginationRange } from "@/lib/pagination";

export default function Home() {
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc"); // default 최신순

  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ["posts", currentPage, sortOrder],
    queryFn: () => fetchPosts(currentPage, ITEMS_PER_PAGE, sortOrder),
    enabled: !isAuthLoading, // 인증 로딩 중이 아닐 때만 게시물 쿼리 실행
  });

  const { data: totalPostsCount } = useQuery({
    queryKey: ["totalPostsCount"],
    queryFn: fetchTotalPostsCount,
    enabled: !isAuthLoading, // 인증 로딩 중이 아닐 때만 총 게시물 수 쿼리 실행
  });

  const totalPages = totalPostsCount ? Math.ceil(totalPostsCount / ITEMS_PER_PAGE) : 1;
  const paginationRange = calculatePaginationRange(currentPage, totalPages, 5); // 5개 페이지 버튼 표시

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading || isAuthLoading) {
    return <div className="container mx-auto p-4 text-center">게시물 로딩 중...</div>;
  }

  if (isError) {
    return <div className="container mx-auto p-4 text-center text-red-500">게시물을 불러오는 데 실패했습니다.</div>;
  }

  // posts가 undefined일 경우를 처리 (데이터가 아직 없거나, 에러는 아니지만 데이터가 비어있는 경우)
  if (!posts) {
    return <div className="container mx-auto p-4 text-center">게시물이 없습니다.</div>;
  }

  return (
    <section className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <select
            className="border rounded-md p-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
          >
            <option value="desc">최신순</option>
            <option value="asc">오래된순</option>
          </select>
        </div>

        {isLoggedIn ? (
          <Link href="/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            글쓰기
          </Link>
        ) : (
          <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            글쓰기
          </Link>
        )}
      </div>

      <div className="border rounded-md overflow-hidden">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
            <Link href={`/${post.id}`} className="block">
              <h2 className="text-lg font-semibold mb-1">#{post.id} {post.title}</h2>
              <div className="text-sm text-gray-600 flex justify-end items-center">
                <span className="mr-4">[댓글 {post.comments}]</span>
                <span className="mr-4">[{post.author}]</span>
                <span>[{post.date}]</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            hidden={currentPage === 1}
            className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {"< 이전"}
          </button>
          {paginationRange.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded-md ${page === currentPage ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            hidden={currentPage === totalPages}
            className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {"다음 >"}
          </button>
        </nav>
      </div>
    </section>
  );
}
