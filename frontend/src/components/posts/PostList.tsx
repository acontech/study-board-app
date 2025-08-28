import { PostListItem } from '@/types/post';
import PostItem from './PostItem';

interface PostListProps {
  posts: PostListItem[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => <PostItem key={post.id} post={post} />)
      ) : (
        <div className="text-center text-gray-500 py-10">
          게시물이 없습니다.
        </div>
      )}
    </div>
  );
}
