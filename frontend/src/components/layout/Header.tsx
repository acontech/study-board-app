import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          업무_게시판
        </Link>
        <nav>
          <Link href="/login" className="btn btn-primary">
            로그인/내정보
          </Link>
        </nav>
      </div>
    </header>
  );
}
