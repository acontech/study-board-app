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
