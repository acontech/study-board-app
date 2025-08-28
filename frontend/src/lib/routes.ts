export const PAGE_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  POST_NEW: '/new',
  post: (id: number | string) => `/${id}`,
  postEdit: (id: number | string) => `/edit/${id}`,
};

export const API_ROUTES = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  ME: '/api/auth/me',
  SIGNUP: '/api/users',
  POSTS: '/api/posts',
  post: (id: number | string) => `/api/posts/${id}`,
  comments: (postId: number | string) => `/api/posts/${postId}/comments`,
  comment: (postId: number | string, commentId: number | string) =>
    `/api/posts/${postId}/comments/${commentId}`,
};
