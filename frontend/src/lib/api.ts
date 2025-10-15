import axios from "axios";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
});

// request.use: 모든 Axios 요청 전에 실행
// 요청 인터셉터: 모든 요청에 JWT 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  author: string;
  views: number;
  comments: number;
  date: string; // created_at을 변환하여 사용
  created_at: string;
  updated_at: string;
}

export interface PostCreatePayload {
  title: string;
  content: string;
}

export interface PostUpdatePayload {
  title?: string;
  content?: string;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface UserSignupPayload {
  email: string;
  password: string;
  nickname: string;
  birthdate?: string; // 백엔드 date 타입과 일치하도록 string으로 설정
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface CommentResponse {
  comment_id: number;
  post_id: number;
  user_id: number;
  author: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CommentCreatePayload {
  post_id: number;
  content: string;
}

export interface CommentUpdatePayload {
  content: string;
}

export const fetchPosts = async (page: number, limit: number, sortOrder: "desc" | "asc" = "desc"): Promise<Post[]> => {
  const skip = (page - 1) * limit;
  const response = await api.get(`/api/posts`, {
    params: { skip, limit, sort: sortOrder },
  });
  return response.data.map((post: any) => ({
    ...post,
    date: new Date(post.created_at).toLocaleDateString('ko-KR'),
  }));
};

export const fetchTotalPostsCount = async (): Promise<number> => {
  const response = await api.get(`/api/posts/count`);
  return response.data;
};

export const fetchPostById = async (postId: number): Promise<Post> => {
  const response = await api.get(`/api/posts/${postId}`);
  return {
    ...response.data,
    date: new Date(response.data.created_at).toLocaleDateString('ko-KR'),
  };
};

export const createPost = async (postData: PostCreatePayload): Promise<Post> => {
  const response = await api.post(`/api/posts/`, postData);
  return {
    ...response.data,
    date: new Date(response.data.created_at).toLocaleDateString('ko-KR'),
  };
};

export const signupUser = async (userData: UserSignupPayload): Promise<any> => {
  const response = await api.post(`/api/users/signup`, userData);
  return response.data;
};

export const checkEmailDuplication = async (email: string): Promise<{ exists: boolean }> => {
  const response = await api.get(`/api/users/check-email`, {
    params: { email },
  });
  return response.data;
};

export const loginUser = async (credentials: UserLoginPayload): Promise<AuthToken> => {
  const response = await api.post(`/api/users/login`, credentials);
  return response.data;
};

export const updatePost = async (postId: number, postData: PostUpdatePayload): Promise<Post> => {
  const response = await api.put(`/api/posts/${postId}`, postData);
  return {
    ...response.data,
    date: new Date(response.data.created_at).toLocaleDateString('ko-KR'),
  };
};

export const deletePost = async (postId: number): Promise<void> => {
  await api.delete(`/api/posts/${postId}`);
};

// Comment API calls
export const getCommentsByPostId = async (postId: number): Promise<CommentResponse[]> => {
  const response = await api.get(`/api/posts/${postId}/comments`);
  return response.data;
};

export const createComment = async (postId: number, content: string, token: string): Promise<CommentResponse> => {
  const response = await api.post(`/api/comments`, { post_id: postId, content }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateComment = async (commentId: number, content: string, token: string): Promise<CommentResponse> => {
  const response = await api.put(`/api/comments/${commentId}`, { content }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteComment = async (commentId: number, token: string): Promise<void> => {
  await api.delete(`/api/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};