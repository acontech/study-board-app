import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          업무_게시판
        </Link>
        <nav className="space-x-3 text-sm">
          <Link href="/auth/login" className="hover:underline">
            로그인
          </Link>
          <Link href="/auth/register" className="hover:underline">
            회원가입
          </Link>
        </nav>
      </div>
    </header>
  );
}
