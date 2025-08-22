## 소스 폴더 구조

```
backend/
├─ app/
│  ├─ main.py                  # FastAPI 앱 팩토리 & 라우터 마운트
│  ├─ core/                    # 환경설정, JWT, 로깅, 예외처리
│  ├─ db/                      # 엔진, 세션 관리
│  ├─ models/                  # SQLAlchemy 모델 (엔티티)
│  ├─ schemas/                 # Pydantic v2 스키마(요청/응답/DTO)
│  ├─ repositories/            # DB 접근 계층(쿼리/CRUD)
│  ├─ services/                # 비즈니스 로직(트랜잭션, 검증)
│  ├─ api/                     # 서비스 API 관리
│  ├─ utils/
│  └─ middleware/
├─ tests/
├─ venv/                       # 파이썬 가상환경 관련
├─ .gitignore                  # 커밋 대상 예외 처리
├─ .prettierignore             # 자동 포멧팅 예외 처리
├─ docker-compose.yml          # MariaDB 실행
├─ README.md
└─ requirements.txt            # 설치 라이브러리 정의
```

### 각 계층의 역할(요약)

- api/: HTTP 인터페이스. 요청/응답 검증(schemas), 권한 검사, 서비스 호출만 담당 (얇게 유지).
- services/: 비즈니스 로직의 중심. 트랜잭션 경계, 도메인 규칙, 여러 repo 조합.
- repositories/: 순수 DB 접근(쿼리/CRUD). 서비스에서만 사용.
- models/: 데이터베이스 테이블(도메인 엔티티).
- schemas/: 입출력 DTO(Pydantic v2). 모델과 분리 → API 안정성↑.
- core/: 설정, 보안(JWT/해시), 로깅, 예외 처리.
- db/: 엔진/세션/베이스 초기화, 시드.
- tests/: 계층별 테스트(E2E/서비스/API). 픽스처로 독립성 확보.

---

## 최초 개발환경 설정 방법

### 1. 도커 데스크탑 설치 필요

- MariaDB 를 도커 기반으로 실행하기 위해 윈도우(OS) 기준으로 도커 데스크탑 설치가 필요하다.

- 설치가 되었다면 cmd 창을 열고 명령을 실행하자.
  
  ```
  docker-compose up -d
  ```

### 2. python 설치 여부 확인

```
python --version
```

> python 3.12.x 버전 사용 권장.
> 
> 설치되지 않은 경우 [Python 공식 사이트](https://www.python.org/downloads/windows/) 에서 3.12.x 버전 설치가 필요함.

### 3. Microsoft C++ Build tools 설치

- 파일을 [다운로드](https://aka.ms/vs/17/release/vs_BuildTools.exe) 받고 cmd 창을 열어서 명령을 실행한다.
  
  ```
  vs_BuildTools.exe --norestart --passive --downloadThenInstall --includeRecommended --add Microsoft.VisualStudio.Workload.NativeDesktop --add Microsoft.VisualStudio.Workload.VCTools --add Microsoft.VisualStudio.Workload.MSBuildTools
  ```

- 설치가 완료 되면 **컴퓨터를 재부팅** 하고 다음 단계를 진행한다.

### 4. python 가상 환경 생성

board-app/backend 경로로 이동하여 명령을 실행

```
python -m venv venv
```

> 또는 파이선 런처를 사용하는 경우에는 ```py -3.12 -m venv venv```

### 5. python 라이브러리 설치

- Visual Studio Code 를 실행하여 board-app/backend 폴더를 오픈한다.

- 하단의 터미널 > cmd 창을 실행한다.
  
  > 예시 : (venv) C:\kwon\acontech\board-app\backend>
  > 
  > 위 예시와 같이 (venv) 표시가 되어 있는지 확인 필요.

- 라이브러리 설치를 위해 순서대로 실행
  
  ```
  python -m pip install --upgrade pip
  python -m pip install --upgrade pip setuptools wheel
  python -m pip install --upgrade cython
  python -m pip install -r requirements.txt
  ```

### 6. 서버 실행

```
uvicorn app.main:app --reload
```

## 네이밍 컨벤션

| 대상                     | 스타일                           | 예시                                          |
| ---------------------- | ----------------------------- | ------------------------------------------- |
| **패키지명 (폴더명)**         | `snake_case` (짧고 소문자)         | `my_project`, `data_utils`                  |
| **모듈명 (.py 파일)**       | `snake_case` (짧고 소문자)         | `models.py`, `string_tools.py`              |
| **클래스명**               | `PascalCase` (CapWords)       | `User`, `DatabaseManager`, `CustomError`    |
| **예외 클래스명**            | `PascalCase` + `Error` 접미사    | `ValueError`, `DatabaseError`               |
| **함수명**                | `snake_case`                  | `get_user()`, `load_data()`, `send_email()` |
| **메서드명**               | `snake_case`                  | `user.save()`, `order.calculate_total()`    |
| **변수명 (지역/전역)**        | `snake_case`                  | `user_name`, `total_count`, `config_path`   |
| **상수명**                | `UPPER_CASE_WITH_UNDERSCORES` | `MAX_RETRY`, `DEFAULT_TIMEOUT`              |
| **보호된 멤버**             | `_snake_case` (접두사 `_`)       | `_internal_cache`, `_helper_func()`         |
| **비공개 멤버 (강제 네임 맹글링)** | `__snake_case` (접두사 `__`)     | `__private_var`, `__do_something()`         |

## API 문서

> API 관련 문서는 자동으로 생성 된다.

- swagger : http://localhost:8000/docs
- redoc : http://localhost:8000/redoc

## 문제 해결

### MariaDB 연결 테스트

- 도커를 통해 MariaDB 가 정상적으로 실행되었다면 아래 명령을 통해 연결이 되는지 확인 가능
  
  ```
  uvicorn app.check_db:app
  ```
  
  > 서버가 실행되면서 DB 연결 성공 또는 실패 메세지가 출력 된다.
