export default function Case1RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 아무 스타일/구조 변경이 필요 없으면 단순히 children만 리턴

  // CHECK: 예약 된 loading/error/not-found tsx 파일들이
  //  동작하려면 layout.tsx 파일이 필요함.
  return <>{children}</>;
}
