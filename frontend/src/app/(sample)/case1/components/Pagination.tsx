// (sample)/case1/components/Pagination.tsx
"use client";
import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const prev = page > 1 ? page - 1 : 1;
  const next = page < totalPages ? page + 1 : totalPages;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2">
      <Link href={`/?page=${prev}`} className="px-3 py-1 border rounded">
        &lt; 이전
      </Link>
      {pages.map((n) => (
        <Link
          key={n}
          href={`/?page=${n}`}
          className={`px-3 py-1 border rounded ${
            n === page ? "bg-gray-200" : ""
          }`}
        >
          {n}
        </Link>
      ))}
      <Link href={`/?page=${next}`} className="px-3 py-1 border rounded">
        다음 &gt;
      </Link>
    </nav>
  );
}
