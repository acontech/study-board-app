## 소스 폴더 구조

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx                       # 첫 화면 = 게시물 목록
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx               # 로그인
│   │   │   └── signup/
│   │   │       └── page.tsx               # 회원가입
│   │   ├── (board)/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx               # 게시물 상세 + 댓글
│   │   │   ├── new/
│   │   │   │   └── page.tsx               # 게시물 작성  (보호)
│   │   │   └── edit/
│   │   │       └── [id]/
│   │   │           └── page.tsx           # 게시물 수정  (보호)
│   │   └── api/                           # BFF: FastAPI 프록시
│   │       ├── auth/
│   │       │   ├── login/route.ts         # POST /api/auth/login
│   │       │   └── me/route.ts            # GET  /api/auth/me
│   │       ├── users/
│   │       │   └── route.ts               # POST /api/users (signup)
│   │       ├── posts/
│   │       │   ├── route.ts               # GET(list), POST(create)
│   │       │   └── [id]/
│   │       │       ├── route.ts           # GET(detail), PATCH, DELETE
│   │       │       └── comments/
│   │       │           ├── route.ts       # GET(list), POST(create)
│   │       │           └── [commentId]/
│   │       │               └── route.ts   # PATCH, DELETE
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx                 # 검색 입력 없음(요청사항 반영), 로그인/로그아웃 버튼
│   │   ├── posts/
│   │   │   ├── PostList.tsx
│   │   │   ├── PostItem.tsx
│   │   │   └── PostForm.tsx               # 제목/내용(plain text)만 (첨부/에디터 X)
│   │   └── comments/
│   │       ├── CommentList.tsx
│   │       └── CommentForm.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                     # 클라이언트 측 사용자 상태 훅(SSR/CSR 혼합 시 보조)
│   │   └── useToast.ts                    # 선택
│   │
│   ├── lib/
│   │   ├── api.ts                         # fetch 래퍼(쿠키 포함)
│   │   ├── auth.ts                        # 서버(SSR)에서 쿠키 읽기 & 리다이렉트 헬퍼
│   │   └── routes.ts                      # 라우트 상수 정의
│   │
│   ├── middleware.ts                      # 보호 라우트(작성/수정)에 로그인 요구
│   ├── styles/
│   │   └── theme.css
│   ├── types/
│   │   ├── auth.ts                        # User, Session 등
│   │   └── post.ts                        # Post, Comment 등
│   └── utils/
│       └── format.ts                      # 날짜 등 공통 포맷
│
├── .env.local                              # NEXT_PUBLIC_API_BASE, …
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## 최초 개발환경 설정 방법

### 1. Node.js 설치

```bash
# 1) Node.js 20.19.4 설치
nvm install 20.19.4

# 2) 설치된 버전 확인
nvm list

# 3) 방금 설치한 버전을 활성화
nvm use 20.19.4

# 4) 현재 Node.js 버전 확인
node -v #출력 : v20.19.4

# 5) 현재 npm 버전 확인
npm -v #출력 : 10.8.2
```

### 2. 라이브러리 설치

- Visual Studio Code 를 실행하여 `board-app/frontend` 폴더를 오픈한다.

- 하단의 터미널 > cmd 창을 실행한다.
  
  > 예시 : C:\kwon\acontech\board-app\frontend>
  > 
  > 위 예시와 같이 frontend 경로가 맞는지 확인 필요.

- 라이브러리 설치를 위해 순서대로 실행
  
  ```bash
  npm ci
  ```

## 3. 서버 실행

```bash
npm run dev
```

## 네이밍 컨벤션

- 주로 kebab-case 를 사용하지만 아닌 경우도 있어서 구분해서 정리함.

### kebab-case 인 경우

| 대상                  | 예시                                                                                |
| ------------------- | --------------------------------------------------------------------------------- |
| **폴더명 (공통/유틸/도메인)** | `components/`, `hooks/`, `lib/`, `server/`, `types/`, `styles/`                   |
| **앱 라우트 세그먼트 폴더**   | `user-profile/`, `posts/`                                                         |
| **동적 세그먼트 폴더**      | `[user-id]/`, `[post-id]/`                                                        |
| **그룹 라우트 폴더**       | `(marketing)/`, `(auth)/`                                                         |
| **슬롯 라우트 폴더**       | `@modal/`, `@chat/`                                                               |
| **유틸리티/서버 코드 파일**   | `date-format.ts`, `string-utils.ts`, `fetcher.ts`, `db-client.ts`, `post-repo.ts` |
| **컨텍스트/스토어 파일**     | `auth-context.tsx`, `theme-context.tsx`, `auth-store.ts`                          |
| **타입 정의 파일**        | `post-types.ts`, `api-types.ts`                                                   |
| **테스트 파일**          | `user-card.test.tsx`, `date-format.spec.ts`                                       |
| **전역 CSS**          | `globals.css`, `reset.css`                                                        |

### kebab-case 가 아닌 경우

| 대상                              | 스타일                     | 예시                                                                                                                                          |
| ------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **React 컴포넌트 파일**               | `PascalCase.tsx`        | `UserCard.tsx`, `PostItem.tsx`                                                                                                              |
| **CSS Module 파일**               | `PascalCase.module.css` | `UserCard.module.css`                                                                                                                       |
| **커스텀 훅 파일**                    | `use-*.ts`              | `use-auth.ts`, `use-infinite-posts.ts`                                                                                                      |
| **예약 파일명 (Next.js App Router)** | 고정명                     | `page.tsx`, `layout.tsx`, `template.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, `default.tsx`, `sitemap.ts`, `robots.ts` |

---
