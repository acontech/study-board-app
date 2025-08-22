## 기본 내용 소개

- [와이어프레임](https://github.com/acontech/study-board-app/blob/main/doc/%EC%97%85%EB%AC%B4_%EA%B2%8C%EC%8B%9C%ED%8C%90_%ED%99%94%EB%A9%B4%EB%B3%84_%EC%99%80%EC%9D%B4%EC%96%B4%ED%94%84%EB%A0%88%EC%9E%84_v_1.md)

- [backend README.md](https://github.com/acontech/study-board-app/blob/main/backend/README.md)

- [frontend README.md](https://github.com/acontech/study-board-app/blob/main/README.md)

- [기본 README.md](https://github.com/acontech/study-board-app/blob/main/README.md)

## 프론트엔드 개발 방향

- 레이아웃 중첩 구성

  - 전체적으로 사용하는 레이아웃(헤더/본문/푸터)

  - 본문에 들어갈 화면별 레이아웃

    - 화면 별 레이아웃 안에 컴포넌트

- 로그인 / 비로그인

  - 로그인 완료 시 JWT 토큰 발행

    - JWT 토큰값 유무로 판단

- 첫화면

  - 비로그인 상태로 게시물 목록 화면 노출

  - 헤더의 로그인 기능을 통해 로그인 가능

- 백엔드 API 호출

  - API Route 를 사용

    ```
    [클라이언트 브라우저]
           │
           ▼
    (fetch("/api/..."))
           │
           ▼
    [Next.js API Route (app/api/*)]
           │
           ▼
    [외부 백엔드 서버]
           │
           ▼
    [Next.js API Route 응답 생성]
           │
           ▼
    [클라이언트로 JSON 반환]
           │
           ▼
    [React 컴포넌트에서 데이터 사용 → 화면 렌더링]
    ```

## 백엔드 개발 방향

- API 개발(회원가입, 로그인, 토큰 발급/검증, 이메일 중복체크 등)

- DB 설계

  - 회원가입(생년월일,닉네임,이메일,비밀번호)
