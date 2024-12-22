import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import { useState } from "react";

function HomePage() {
  const navigate = useNavigate();
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0); // 진행률 상태

  const handleFileUpload = async (file) => {
    if (file) {
      console.log("Uploaded file:", file.name);
      setTranscription(""); // 기존 결과 초기화
      setLoadingProgress(0);
      setLoading(true);

      // 가짜 진행률 시뮬레이션
      const fakeProgress = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(fakeProgress); // 최대 90%까지 진행
            return 90;
          }
          return prev + 10; // 10%씩 증가
        });
      }, 500);
      
      // FormData 생성
      const formData = new FormData();
      formData.append("file", file);

      try {
        // 백엔드 API 호출
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setTranscription(data.transcription); // 변환된 텍스트 표시
        } else {
          console.error("오류 발생:", response.statusText);
          alert("변환 실패");
        }
      } catch (error) {
        console.error("에러 발생:", error);
        alert("파일 업로드 중 문제가 발생했습니다.");
      } finally {
        clearInterval(fakeProgress); // 진행률 시뮬레이션 종료
        setLoadingProgress(100); // 완료
        setLoading(false);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault(); // 기본 동작 방지
    event.stopPropagation(); // 이벤트 전파 방지
    const files = event.dataTransfer?.files; // 안전하게 dataTransfer 접근
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        handleFileUpload(file);
      } else {
        alert('오디오 파일만 업로드할 수 있습니다.');
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // 기본 동작 방지
    event.stopPropagation(); // 이벤트 전파 방지
  };

  // 텍스트 파일 다운로드 함수
  const handleDownload = () => {
    const blob = new Blob([transcription], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transcription.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Header Section */}
      <header className="App-header">
        <div className="logo">(KO) my project</div>
        <nav className="nav-menu">
          <Link to="/get-started">가이드</Link>
          <a href="#github">요금제</a>
          <a href="#designers">자주 묻는 질문</a>
          <a href="#documentation" className="highlighted">로그인</a>
        </nav>
      </header>

      {/* Main Hero Section */}
      <main className="App-main">
        <section className="hero">
          <h1>음성을 텍스트로</h1>
          <p>모든 음성 파일을 텍스트로 변환하세요.</p>
        </section>

        {/* Transcription Result Section */}
        {loading ? (
          <div style={{ marginTop: '20px' }}>
            <p>변환 중입니다... 잠시만 기다려 주세요.</p>
            <div style={{
              width: '100%',
              maxWidth: '400px',
              height: '20px',
              backgroundColor: '#eee',
              borderRadius: '10px',
              overflow: 'hidden',
              margin: '10px auto'
            }}>
              <div style={{
                width: `${loadingProgress}%`,
                height: '100%',
                backgroundColor: '#007bff',
                transition: 'width 0.5s ease-in-out'
              }} />
            </div>
            <p>{loadingProgress}% 완료</p>
          </div>
        ) : transcription ? (
          <div style={{ marginTop: '20px', marginBottom: '20px', padding: '10px', backgroundColor: '#f3f3f3', borderRadius: '5px' }}>
            <h3>변환된 텍스트:</h3>
            <p>{transcription}</p>
            <button 
              onClick={handleDownload} 
              style={{
                marginTop: '10px',
                padding: '10px 15px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              다운로드
            </button>
          </div>
        ) : null}

        {/* Cards Section */}
        <section className="cards">
          <div
            className="card"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              border: '2px dashed #ccc',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#f9f9f9',
            }}
          >
            <img src="/img/img_download.png" alt="Avatar" className="card-img" />
            <h3>MP3 TO TEXT</h3>
            <p>여기로 파일을 끌어다 놓으세요.</p>
            <label htmlFor="card-file-upload" className="btn-follow">
              업로드
            </label>
            <input
              id="card-file-upload"
              type="file"
              accept=".mp3, audio/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer style={{ 
        backgroundColor: '#000',
        color: '#fff',
        textAlign: 'center',
        padding: '20px',
        fontSize: '14px',
        lineHeight: '1.6',
        position: 'fixed',       // 화면에 고정
        bottom: '0',             // 화면 맨 아래에 붙음
        left: '0',               // 왼쪽 끝 정렬
        width: '100%',           // 전체 가로폭 차지
      }}>
        <p>&copy; 2024 My Project. All Rights Reserved.</p>
        <p>
          문의사항: 
          <a 
            href="mailto:akfls367@naver.com" 
            style={{ 
              color: '#fff', 
              textDecoration: 'underline'
            }}
          >
            akfls367@naver.com
          </a>
        </p>
      </footer>

    </div>
  );
}

export default HomePage;
