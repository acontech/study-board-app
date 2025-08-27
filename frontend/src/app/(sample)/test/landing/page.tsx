export default async function TestLoadingPage() {
  // 의도적으로 지연시켜서 layout의 Loading이 보이도록 함
  await new Promise((res) => setTimeout(res, 3000));
  return <div className="text-center">로딩 후 화면 (3초 지연 완료)</div>;
}
