# AssemblyAI Audio to Text Web App

이 프로젝트는 AssemblyAI를 사용하여 오디오 파일을 텍스트로 변환하는 웹 애플리케이션입니다. React로 구현되었으며, 백엔드는 Express.js를 사용하여 구성되었습니다. 사용자는 간단한 인터페이스를 통해 오디오 파일을 업로드하고 텍스트로 변환된 결과를 확인할 수 있습니다.

## 주요 기능 (Key Features)

- **오디오 업로드**: 사용자가 로컬 디바이스에서 오디오 파일을 업로드.
- **텍스트 변환**: AssemblyAI API를 사용하여 오디오를 텍스트로 변환.
- **결과 표시**: 텍스트 변환 결과를 실시간으로 UI에 표시.
- **다국어 지원**: 다양한 언어의 오디오 파일 변환 가능.

---

## 기술 스택 (Tech Stack)

- **Frontend**: React
- **Backend**: Express.js, Node.js
- **API**: [AssemblyAI API](https://www.assemblyai.com/)

---

## 프로젝트 시작하기 (Getting Started)

### 사전 준비 (Prerequisites)

1. Node.js (v16 이상)
2. AssemblyAI API 키 ([여기서 발급받기](https://www.assemblyai.com/dashboard))

#### Backend

```bash
# server 디렉토리로 이동
$ cd server

# 서버 실행
$ node server.js
```

#### Frontend

```bash
# 프로젝트 루트로 이동
$ cd ../

# 개발 서버 실행
$ npm start
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

---

## 사용법 (Usage)

1. **오디오 파일 업로드**: "+ Upload File" 버튼 클릭 후 파일 선택.
2. **변환 시작**: 변환 과정이 자동으로 시작됩니다.
3. **결과 확인**: 변환이 완료되면 화면에 텍스트 결과가 표시됩니다.

---

## 프로젝트 구조 (Project Structure)

```
MY-REACT-APP/
├── node_modules/           # 의존성 라이브러리
├── public/                 # 정적 파일
├── server/                 # 백엔드 서버
│   └── server.js           # Express.js 서버 코드
├── src/                    # 프론트엔드 소스 코드
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── getStartedPage.js
│   │   └── homePage.js
│   ├── App.css             # 메인 CSS 스타일 파일
│   ├── App.js              # 메인 React 컴포넌트
│   ├── App.test.js         # 테스트 코드
│   ├── index.css           # 글로벌 CSS 파일
│   ├── index.js            # React 진입점
│   ├── logo.svg            # 로고 파일
│   ├── reportWebVitals.js  # 웹 성능 리포트 설정
│   └── setupTests.js       # 테스트 설정 파일
├── uploads/                # 업로드된 파일 저장소
├── .gitignore              # Git에서 제외할 파일 설정
├── package-lock.json       # 의존성 버전 잠금 파일
├── package.json            # 프로젝트 의존성 및 설정
├── README.md               # 프로젝트 설명 파일
└── test.mp3                # 테스트용 오디오 파일
```