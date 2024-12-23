import { useNavigate, Link } from 'react-router-dom';
import { useState } from "react";
import Header from './header'; // Header 컴포넌트 import

function HomePage() {
  const navigate = useNavigate();
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleFileUpload = async (file) => {
    if (file) {
      setTranscription("");
      setLoadingProgress(0);
      setLoading(true);

      // 가짜 진행률 시뮬레이션
      const fakeProgress = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(fakeProgress);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

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
    event.preventDefault();
    const files = event.dataTransfer?.files;
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
    event.preventDefault();
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
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <Header /> {/* 재사용 가능 Header 컴포넌트 */}

      {/* Main Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 text-center">
        <section className="mb-10">
          <h1 className="text-4xl font-bold mb-4">음성을 텍스트로</h1>
          <p className="text-lg">모든 음성 파일을 텍스트로 변환하세요.</p>
        </section>

        {/* Transcription Result Section */}
        {loading ? (
          <div className="w-full max-w-lg mx-auto text-center">
            <p className="mb-4">변환 중입니다... 잠시만 기다려 주세요.</p>
            <div className="relative w-full h-5 bg-gray-300 rounded">
              <div
                className="absolute h-full bg-blue-500 transition-all"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-700">{loadingProgress}% 완료</p>
          </div>
        ) : transcription ? (
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg mx-auto">
            <h3 className="font-bold text-lg mb-2">변환된 텍스트:</h3>
            <p className="text-sm text-gray-700 mb-4">{transcription}</p>
            <button
              onClick={handleDownload}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              다운로드
            </button>
          </div>
        ) : null}

        {/* Upload Section */}
        <section
          className="border-2 border-dashed border-gray-400 rounded-lg p-6 bg-white shadow w-full max-w-lg text-center mt-6"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <img
            src="/img/img_download.png"
            alt="Drag and drop area"
            className="mx-auto mb-4 w-16 h-16"
          />
          <h3 className="text-lg font-bold mb-2">MP3 TO TEXT</h3>
          <p className="text-sm text-gray-600 mb-4">여기로 파일을 끌어다 놓으세요.</p>
          <label
            htmlFor="file-upload"
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
          >
            업로드
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".mp3, audio/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-black text-white py-6 text-center">
        <p>&copy; 2024 My Project. All Rights Reserved.</p>
        <p>
          문의사항: 
          <a
            href="mailto:akfls367@naver.com"
            className="underline hover:text-gray-400"
          >
            akfls367@naver.com
          </a>
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
