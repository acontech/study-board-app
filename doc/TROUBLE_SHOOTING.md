# VS Code 파이썬 가상환경(venv) 인식 불가 문제 해결 가이드

## 문제 상황

VS Code에서 `app/main.py`와 같은 파이썬 파일의 `import` 구문에 노란 줄이 표시되며, 다음과 같은 오류 메시지가 나타남.

```
"가져오기 "fastapi"을(를) 확인할 수 없습니다." (Pylance: reportMissingImports)
```

분명히 터미널에서는 `pip install -r requirements.txt`를 통해 `venv` 가상 환경에 패키지를 모두 설치했음에도 불구하고 문제가 발생함.

## 원인

VS Code 편집기가 프로젝트의 가상 환경(`venv`)에 설치된 파이썬 인터프리터를 사용하지 않고, 시스템의 기본 파이썬 인터프리터를 사용하고 있기 때문입니다. 따라서 가상 환경에만 설치된 `fastapi` 같은 라이브러리를 찾지 못하는 것입니다.

## 해결 방법

VS Code가 올바른 파이썬 인터프리터(venv 내의 것)를 사용하도록 경로를 지정해주어야 합니다.

### 방법 1: VS Code 명령 팔레트에서 인터프리터 선택

1.  VS Code에서 `Ctrl+Shift+P` 단축키를 눌러 **명령 팔레트(Command Palette)**를 엽니다.
2.  입력창에 `Python: Select Interpreter`를 검색하고 선택합니다.
3.  나타나는 목록에서 경로에 `venv`가 포함된 인터프리터를 선택합니다. (예: `C:\kwon\acontech\study-board-app\backend\venv\Scripts\python.exe`)

### 방법 2: 인터프리터 목록에 표시되지 않을 경우 (경로 직접 입력)

위의 목록에서 `venv` 인터프리터가 보이지 않을 때 사용하는 방법입니다.

1.  `Python: Select Interpreter` 실행 후, 목록 상단의 **'Enter interpreter path...'** 옵션을 클릭합니다.
2.  파일 경로를 입력하는 창이 나타나면, `venv` 폴더 내의 파이썬 실행 파일 경로를 직접 입력하거나 찾아 선택합니다.
    *   **경로 예시**: `C:\kwon\acontech\study-board-app\backend\venv\Scripts\python.exe`

### 추가 팁: 영구적인 해결책 (.vscode/settings.json 설정)

매번 인터프리터를 설정하는 것이 번거롭다면, 프로젝트 폴더 내에 VS Code 설정 파일을 만들어 두는 것이 가장 확실한 방법입니다.

1.  프로젝트 최상위 폴더 (`C:\kwon\acontech\study-board-app\backend`)에 `.vscode` 라는 이름의 폴더를 생성합니다.
2.  `.vscode` 폴더 내에 `settings.json` 파일을 생성하고 아래 내용을 추가합니다.

```json
{
  "python.pythonPath": "C:/kwon/acontech/study-board-app/backend/venv/Scripts/python.exe"
}
```

이렇게 설정하면, 앞으로 이 프로젝트를 VS Code로 열 때마다 자동으로 지정된 가상 환경의 인터프리터를 사용하게 됩니다.

---

## 문제 2: 상위 폴더에서 하위 프로젝트 디버깅 실행 불가

### 문제 상황

`backend`와 `frontend` 폴더를 모두 보기 위해, 그 상위 폴더인 `study-board-app`을 VS Code에서 열었다.

이 상태에서 `backend` 프로젝트의 `launch.json`을 이용해 디버깅(F5)을 실행하려고 하면, VS Code가 디버깅 설정을 찾지 못하고 "launch.json 파일을 생성하시겠습니까?" 라는 등의 메시지를 보여준다.

### 원인

VS Code는 현재 열려있는 폴더의 최상위 레벨에 있는 `.vscode` 폴더(`study-board-app/.vscode`)에서 `launch.json`을 찾는다.

하지만 디버깅 설정 파일은 하위 폴더인 `backend/.vscode` 안에 위치해 있기 때문에, VS Code가 설정을 발견하지 못하는 것이다.

### 해결 방법: 다중 루트 워크스페이스 (Multi-root Workspace) 설정

프론트엔드와 백엔드처럼 독립적인 여러 프로젝트를 하나의 창에서 관리할 때는 '다중 루트 워크스페이스' 기능을 사용하는 것이 가장 표준적인 방법이다.

#### 설정 순서

1.  **기존 `launch.json` 유지**
    *   `backend` 프로젝트를 위해 만들었던 `backend/.vscode/launch.json` 파일은 그대로 유지한다.

2.  **작업 영역(Workspace)으로 저장**
    *   `study-board-app` 폴더가 열려있는 상태에서, VS Code 상단 메뉴의 `파일(File)` > `다른 이름으로 작업 영역 저장...(Save Workspace As...)`을 클릭한다.

3.  **`.code-workspace` 파일 저장**
    *   파일 저장 위치를 `study-board-app` 폴더 최상위로 하고, 파일 이름을 `study-board.code-workspace` 와 같이 지정하여 저장한다.
    *   이때 생성될 파일의 내용은 다음과 같다.
    ```json
    {
      "folders": [
        {
          "path": "backend"
        },
        {
          "path": "frontend"
        }
      ],
      "settings": {}
    }
    ```

#### 사용 방법

1.  **워크스페이스 열기**
    *   앞으로 이 프로젝트 작업을 할 때는 `study-board-app` 폴더를 여는 대신, `study-board.code-workspace` **파일**을 VS Code로 열어야 한다. (`파일 > 파일에서 작업 영역 열기...`)

2.  **디버깅 실행**
    *   워크스페이스를 열면 '실행 및 디버그' 탭의 디버깅 목록이 각 폴더별로 그룹화되어 나타난다.
    *   `Python: FastAPI (backend)` 설정을 선택하고 F5를 누르면 `backend` 프로젝트의 디버깅이 정상적으로 시작된다.
