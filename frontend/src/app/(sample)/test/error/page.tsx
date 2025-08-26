export default function TestErrorPage() {
  // 렌더 중 예외 발생 → app/error.tsx(에러 바운더리)가 동작
  throw new Error("의도적인 테스트 에러");
}
