/*

사용 예시

const e1 = ApiError.fromStatus(400, "Bad Request");
const e2 = ApiError.fromStatusAndUrl(404, "Not Found", "https://example.com/api/resource");

*/
export class ApiError extends Error {
  status: number;
  message: string;
  url?: string;
  cause?: unknown; // 원인이 된 실제 에러(선택)

  private constructor(
    status: number,
    message: string,
    url?: string,
    cause?: unknown
  ) {
    super(message);

    this.status = status;
    this.message = message;
    this.url = url;
    this.name = "ApiError";
    this.cause = cause;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      url: this.url,
      stack: this.stack,
    };
  }

  // IDEA: static 메소드를 사용하여 다양한 방식으로 ApiError 객체 생성 가능.
  static fromStatus(status: number, message: string) {
    return new ApiError(status, message);
  }

  static fromUrlAndCause(url: string, cause: unknown) {
    return new ApiError(0, "API Error", url, cause);
  }

  static fromStatusAndUrl(status: number, message: string, url: string) {
    return new ApiError(status, message, url);
  }

  // IDEA: 타입 가드 문법을 사용하여 error 객체가 ApiError 인지 확인.
  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}
