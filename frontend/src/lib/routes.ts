// REVIEW: 페이지 이동 경로와 API 엔드포인트를 한 곳에서 관리하는 것은 괜찮은 방법이라고 생각.
// 하지만 매번 이곳을 통해 실제 경로를 확인하는 경우가 빈번히 발생 할 수도 있음.

export const PAGE_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  POST_NEW: "/new",
  post: (id: number | string) => `/${id}`,
  postEdit: (id: number | string) => `/edit/${id}`,
};

export const API_ROUTES = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  ME: "/api/auth/me",
  SIGNUP: "/api/users",
  POSTS: "/api/posts",
  post: (id: number | string) => `/api/posts/${id}`,
  comments: (postId: number | string) => `/api/posts/${postId}/comments`,
  comment: (postId: number | string, commentId: number | string) =>
    `/api/posts/${postId}/comments/${commentId}`,
};
