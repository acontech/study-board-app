export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="space-y-4 text-center">
        {/* 심플 스피너 */}
        <svg
          className="animate-spin h-10 w-10 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>

        <p className="text-sm text-gray-600">
          로딩 중입니다… 잠시만 기다려주세요.
        </p>

        {/* 간단한 컨텐츠 스켈레톤 예 */}
        <div className="mt-6 max-w-lg w-full space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
