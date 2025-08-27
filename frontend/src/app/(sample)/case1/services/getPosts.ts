// (sample)/case1/services/getPosts.ts
export async function getPosts({
  sort,
  page,
}: {
  sort: "latest" | "oldest";
  page: number;
}) {
  // 학습용 목업 데이터. 실무에서는 DB/외부 API 연동으로 교체.
  const pageSize = 10;
  const total = 23;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const count = Math.min(pageSize, total - start);
  const items = Array.from({ length: Math.max(0, count) }).map((_, i) => {
    const id = start + i + 1;
    return {
      id,
      title: `#${id} 제목`,
      author: "작성자 닉",
      commentCount: Math.floor(Math.random() * 13),
      createdAt: "2025-08-20",
    };
  });
  return { items, totalPages };
}
