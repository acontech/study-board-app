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

| Prefix        | 의미                                                             | 예시                                          |
| ------------- | ---------------------------------------------------------------- | --------------------------------------------- |
| **feat:**     | 새로운 기능 추가 (feature)                                       | `feat: 로그인 API 추가`                       |
| **fix:**      | 버그 수정                                                        | `fix: 회원가입 시 중복 이메일 체크 오류 수정` |
| **docs:**     | 문서 변경 (README, 주석, 문서화 등)                              | `docs: API 사용법 문서 업데이트`              |
| **style:**    | 코드 스타일 변경 (포맷팅, 세미콜론, 띄어쓰기 등. 기능 변화 없음) | `style: eslint 규칙에 맞게 코드 포맷팅`       |
| **refactor:** | 리팩토링 (기능 변화 없음, 코드 구조 개선)                        | `refactor: DB 연결 로직 공통 함수로 분리`     |
| **test:**     | 테스트 코드 추가/수정                                            | `test: 로그인 API 단위 테스트 추가`           |
| **chore:**    | 빌드, 패키지, 설정 파일 변경 (CI/CD, dependencies 등)            | `chore: eslint 버전 업데이트`                 |
| **perf:**     | 성능 개선                                                        | `perf: 게시판 목록 조회 속도 최적화`          |
| **ci:**       | CI 관련 설정 및 스크립트 수정                                    | `ci: GitHub Actions 빌드 파이프라인 수정`     |
| **build:**    | 빌드 시스템 혹은 외부 의존성에 영향이 있는 변경                  | `build: Dockerfile Node 버전 업그레이드`      |
| **revert:**   | 이전 커밋 되돌리기                                               | `revert: feat: 로그인 API 추가`               |

## 브랜치 관리

### Git Flow Lite 방식

| 브랜치            | 역할                                                | 생성/사용 시점                                   | 머지 대상               |
| ----------------- | --------------------------------------------------- | ------------------------------------------------ | ----------------------- |
| **main**          | 항상 안정된(프로덕션 배포용) 코드 보관              | 최종 릴리스 시                                   | 없음 (최종 결과만 유지) |
| **dev (develop)** | 여러 feature를 통합하는 개발 브랜치, 테스트/QA 기준 | 기능 개발이 완료되면 feature 브랜치를 dev에 머지 | main                    |
| **feature/\***    | 개별 기능/이슈 개발 브랜치                          | 새 기능이나 버그 수정 시작할 때 dev에서 분기     | dev                     |

```
 feature/1 ─┐
 feature/2 ─┼──▶ dev ───▶ main
 feature/3 ─┘

```

### feature 브랜치 -> dev 브랜치에 Merge 과정

| 단계                      | 명령어 예시                                                             | 설명                                                                 |
| ------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1. 최신 dev 가져오기      | `git checkout dev` <br> `git pull origin dev`                           | 로컬 dev 브랜치를 최신 상태로 업데이트                               |
| 2. feature 브랜치로 이동  | `git checkout feature/xxx`                                              | 작업 중이던 feature 브랜치로 이동                                    |
| 3. dev 최신 내용 반영     | `git merge dev`                                                         | dev 에서 변경된 내용을 feature 브랜치에 먼저 머지해서 충돌 미리 해결 |
| 4. 충돌 해결 및 커밋      | (충돌 발생 시 파일 수정) <br> `git add .` <br> `git commit`             | 충돌 해결 후 커밋                                                    |
| 5. dev 로 이동            | `git checkout dev`                                                      | dev 브랜치로 전환                                                    |
| 6. feature 를 dev 에 병합 | `git merge feature/xxx`                                                 | feature 브랜치를 dev 브랜치에 병합                                   |
| 7. dev 푸시               | `git push origin dev`                                                   | 원격 dev 브랜치에 병합 결과 반영                                     |
| 8. (선택) feature 삭제    | `git branch -d feature/xxx` <br> `git push origin --delete feature/xxx` | 작업이 끝난 feature 브랜치를 로컬/원격에서 정리                      |

## GitHub Pull Request 과정 정리

| 단계                       | 설명                                                                                                       | 예시 명령어/행동                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **1. 브랜치 분기**         | 새로운 작업(기능/버그 수정)을 시작할 때, 기준 브랜치(`dev` 등)에서 `feature` 브랜치를 생성                 | `git checkout dev` <br> `git pull origin dev` <br> `git checkout -b feature/로그인-기능` |
| **2. 기능 개발**           | 코드 작성 및 커밋                                                                                          | `git add .` <br> `git commit -m "로그인 기능 추가"`                                      |
| **3. 원격 브랜치 푸시**    | 로컬 feature 브랜치를 GitHub 원격 저장소에 올림                                                            | `git push origin feature/로그인-기능`                                                    |
| **4. Pull Request 생성**   | GitHub 웹 UI에서 `feature/로그인-기능` → `dev` 로 병합 요청(PR) 생성                                       | GitHub 웹에서 **“Compare & pull request”** 버튼 클릭                                     |
| **5. PR 설명 작성**        | 변경 내용, 목적, 스크린샷/테스트 방법 등을 PR 템플릿이나 코멘트에 작성                                     | 예: “로그인 API 연동 및 UI 구현 완료, QA 필요”                                           |
| **6. 코드 리뷰**           | 팀원들이 PR을 보고 리뷰, 코멘트 남기기, 변경 요청 가능                                                     | GitHub에서 **Review changes** 기능 사용                                                  |
| **7. 피드백 반영**         | 리뷰에서 받은 요청을 수정 후 다시 커밋 & 푸시 → PR 자동 업데이트                                           | `git push origin feature/로그인-기능`                                                    |
| **8. CI/CD 확인**          | GitHub Actions 등 CI가 자동으로 빌드/테스트 확인                                                           | ✅ 통과해야 머지 가능                                                                    |
| **9. 승인(Approve)**       | 필요한 리뷰어가 “Approve” 클릭                                                                             | 보통 팀 규칙에 따라 1명 이상 승인 필요                                                   |
| **10. Merge (병합)**       | `Merge commit` / `Squash and merge` / `Rebase and merge` 중 선택하여 기준 브랜치(`dev` 또는 `main`)에 병합 | GitHub 웹 UI → “Merge pull request” 버튼                                                 |
| **11. 브랜치 정리**        | 병합 완료 후 feature 브랜치를 삭제 (GitHub UI or 명령어)                                                   | `git branch -d feature/로그인-기능` <br> `git push origin --delete feature/로그인-기능`  |
| **12. 기준 브랜치 동기화** | 로컬의 `dev`/`main` 을 최신 상태로 맞춤                                                                    | `git checkout dev` <br> `git pull origin dev`                                            |
