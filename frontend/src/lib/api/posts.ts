import { Comment, Post, PostListItem } from "@/types/post";
import { API_ROUTES } from "@/lib/routes";
import { ApiError } from "@/lib/error/api-error";

// FIXME: 목업 데이터
const mockComments: Comment[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  content: `정말 좋은 글입니다! ${i + 1}`,
  created_at: new Date(
    Date.now() - Math.random() * 1000 * 60 * 60 * 2
  ).toISOString(),
  updated_at: new Date(
    Date.now() - Math.random() * 1000 * 60 * 60 * 2
  ).toISOString(),
  author: {
    id: (i % 2) + 2, // 2, 3
    email: `commenter${(i % 2) + 2}@example.com`,
    nickname: `댓글러${(i % 2) + 2}`,
    birth_date: "1995-01-01",
  },
  post_id: 1, // post id와 일치시켜야 함
}));

const mockPost: Post = {
  id: 1,
  title: "목업 데이터 제목입니다",
  content:
    "여기는 목업 데이터의 본문입니다. 백엔드 API가 연결되지 않았을 때 표시되는 테스트용 텍스트입니다. 길이를 늘리기 위해 여러 번 반복합니다. 여기는 목업 데이터의 본문입니다. 백엔드 API가 연결되지 않았을 때 표시되는 테스트용 텍스트입니다. 길이를 늘리기 위해 여러 번 반복합니다. 여기는 목업 데이터의 본문입니다. 백엔드 API가 연결되지 않았을 때 표시되는 테스트용 텍스트입니다. 길이를 늘리기 위해 여러 번 반복합니다.",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  author: {
    id: 1,
    email: "test@example.com",
    nickname: "테스트유저",
    birth_date: "1990-01-01",
  },
  comments: mockComments,
  view_count: 123,
};

export async function getPost(id: string): Promise<Post | null> {
  /*
  // FIXME: 백엔드 연동 시 아래 주석 해제
  try {
    const res = await fetch(`${process.env.API_URL}${API_ROUTES.post(id)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
  */
  // FIXME: 임시 목업 데이터 반환
  console.log(`Returning mock post for id: ${id}`);
  return Promise.resolve({ ...mockPost, id: parseInt(id, 10) });
}

export async function getComments(id: string): Promise<Comment[]> {
  /*
  // FIXME: 백엔드 연동 시 아래 주석 해제
  try {
    const res = await fetch(`${process.env.API_URL}${API_ROUTES.comments(id)}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
  */
  // FIXME: 임시 목업 데이터 반환
  console.log(`Returning mock comments for post id: ${id}`);
  return Promise.resolve(
    mockComments.map((c) => ({ ...c, post_id: parseInt(id, 10) }))
  );
}

// FIXME: 목업 데이터
const mockPosts: PostListItem[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `게시물 제목 ${i + 1}`,
  author: {
    id: (i % 3) + 1,
    email: `user${(i % 3) + 1}@example.com`,
    nickname: `유저${(i % 3) + 1}`,
    birth_date: "1990-01-01",
  },
  comment_count: Math.floor(Math.random() * 15),
  created_at: new Date(
    Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7
  ).toISOString(),
})).sort(
  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
);

export async function getPosts(): Promise<PostListItem[]> {
  // REVIEW: fetch API 사용 시 예외를 throw 하고 상위 호출자에서 처리하도록 개선.
  //  기존에는 return [] 이였지만, 실제 데이터가 없는건지 통신의 오류인지 구분 할 수 없었음.

  try {
    // API 서버의 /api/posts/ 에 요청을 보냅니다.
    // const res = await fetch(`${process.env.API_URL}${API_ROUTES.POSTS}`, {
    //   cache: "no-store",
    // });

    // const res = new Response(null, { status: 500 }); // 임시로 항상 에러 발생 시킴.

    // if (!res.ok) {
    //   // 응답 상태와 메세지를 인자값으로 사용하였는데
    //   //  필요에 따라 특정 코드 값을 정의 하여 사용 할 수 있음.
    //   throw ApiError.fromStatusAndUrl(
    //     res.status,
    //     "응답 오류",
    //     `${process.env.API_URL}${API_ROUTES.POSTS}`
    //   );
    // }

    // return res.json();

    // FIXME: 임시 목업 데이터 반환
    console.log("Returning mock posts for main page");
    return Promise.resolve(mockPosts);
  } catch (error: unknown) {
    throw error;
  }
}
