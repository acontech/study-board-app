import { notFound } from "next/navigation";

export default function TestNotFoundPage() {
  // 조건에 따라 notFound() 호출하면 app/not-found.tsx가 렌더됩니다
  notFound();
}
