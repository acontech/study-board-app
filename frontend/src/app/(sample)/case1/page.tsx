// (sample)/case1/app/page.tsx
import { getPosts } from "./services/getPosts";
import Pagination from "./components/Pagination";
import Link from "next/link";

type SearchParams = {
  sort?: "latest" | "oldest";
  page?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const param = await searchParams;
  const sort = param.sort ?? "latest";
  const page = Number(param.page ?? 1);
  const { items, totalPages } = await getPosts({ sort, page });

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <form className="flex items-center gap-2">
          <label className="text-sm">정렬</label>
          <select
            name="sort"
            defaultValue={sort}
            className="border rounded px-3 py-2 text-sm bg-white"
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </form>
        <Link
          href="/posts/new"
          className="px-3 py-2 rounded bg-black text-white text-sm"
        >
          글쓰기
        </Link>
      </div>

      <ul className="divide-y rounded border">
        {items.map((p) => (
          <li key={p.id} className="p-4">
            <Link href={`/posts/${p.id}`} className="block">
              <div className="font-medium">{p.title}</div>
              <div className="mt-1 text-xs text-gray-500">
                댓글 {p.commentCount} · {p.author} · {p.createdAt}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Pagination page={page} totalPages={totalPages} />
    </section>
  );
}
