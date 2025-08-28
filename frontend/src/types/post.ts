import { User } from './auth';

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  author: User;
  post_id: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: User;
  comments: Comment[];
  view_count: number;
}

export interface PostListItem {
  id: number;
  title: string;
  created_at: string;
  author: User;
  comment_count: number;
}
