## 프로젝트 구조

```
/board-app
  ├─ frontend/                 # Next.js (App Router)
  ├─ backend/                  # FastAPI
  ├─ doc/                      # 프로젝트에 필요한 공유 문서들
  └─ README.md
```

## 프로젝트 설치

```bash
git clone https://github.com/acontech/study-board-app.git
```

> git clone 한 로컬 경로안에 frontend, backend 폴더가 있습니다.
> 
> 폴더 안에 README.md 파일을 보시고 추가적인 설치 과정을 이어가시면 됩니다.

## commit 컨벤션

| Prefix        | 의미                                        | 예시                                |
| ------------- | ----------------------------------------- | --------------------------------- |
| **feat:**     | 새로운 기능 추가 (feature)                       | `feat: 로그인 API 추가`                |
| **fix:**      | 버그 수정                                     | `fix: 회원가입 시 중복 이메일 체크 오류 수정`     |
| **docs:**     | 문서 변경 (README, 주석, 문서화 등)                 | `docs: API 사용법 문서 업데이트`           |
| **style:**    | 코드 스타일 변경 (포맷팅, 세미콜론, 띄어쓰기 등. 기능 변화 없음)   | `style: eslint 규칙에 맞게 코드 포맷팅`     |
| **refactor:** | 리팩토링 (기능 변화 없음, 코드 구조 개선)                 | `refactor: DB 연결 로직 공통 함수로 분리`    |
| **test:**     | 테스트 코드 추가/수정                              | `test: 로그인 API 단위 테스트 추가`         |
| **chore:**    | 빌드, 패키지, 설정 파일 변경 (CI/CD, dependencies 등) | `chore: eslint 버전 업데이트`           |
| **perf:**     | 성능 개선                                     | `perf: 게시판 목록 조회 속도 최적화`          |
| **ci:**       | CI 관련 설정 및 스크립트 수정                        | `ci: GitHub Actions 빌드 파이프라인 수정`  |
| **build:**    | 빌드 시스템 혹은 외부 의존성에 영향이 있는 변경               | `build: Dockerfile Node 버전 업그레이드` |
| **revert:**   | 이전 커밋 되돌리기                                | `revert: feat: 로그인 API 추가`        |
