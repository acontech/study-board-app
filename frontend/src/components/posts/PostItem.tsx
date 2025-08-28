import Link from 'next/link';
import { PostListItem } from '@/types/post';
import { formatDate } from '@/utils/format';
import { PAGE_ROUTES } from '@/lib/routes';

interface PostItemProps {
  post: PostListItem;
}

export default function PostItem({ post }: PostItemProps) {
  return (
    <Link href={PAGE_ROUTES.post(post.id)} className="block p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h2>
        <div className="text-sm text-gray-500 flex-shrink-0 ml-4">
          댓글 {post.comment_count}
        </div>
      </div>
      <div className="text-sm text-gray-500 flex justify-end items-center gap-4">
        <span>{post.author.nickname}</span>
        <span>{formatDate(post.created_at)}</span>
      </div>
    </Link>
  );
}
