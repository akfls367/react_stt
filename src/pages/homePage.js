import { useNavigate, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from "react";
import Header from './header'; // Header 컴포넌트 import

function FadeInSection({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`transition-opacity duration-1000 ease-in-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
}

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
      <main className="flex-grow flex flex-col items-center text-center">
        {/* Hero Section과 Upload Section을 포함하는 회색 배경 */}
        <section className="w-full bg-gray-100">
          <div className="mb-5 mt-20">
            <h1 className="text-5xl font-bold mb-4">음성을 텍스트로</h1>
            <p className="text-lg">모든 음성 파일을 텍스트로 변환하세요.</p>
          </div>

          {/* Upload Section */}
          <section
            className="border-2 border-dashed border-gray-400 rounded-lg p-6 bg-white shadow w-full max-w-lg mx-auto text-center mt-6 mb-10"
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

          {/* Transcription Result Section */}
          {loading ? (
            <div className="w-full max-w-lg mx-auto text-center mb-10">
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
            <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg mx-auto mb-10">
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
        </section>
        
        {/* 카드 섹션 포함 */}
        <section className="bg-white w-full">
          <div className="mt-16 mb-16 w-full max-w-7xl px-4 mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 text-left mb-6">
              추천 기능
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <FadeInSection key={item}>
                  <div className="bg-white shadow-lg rounded-lg p-8 text-left">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      기능 {item}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      이 기능은 사용자가 음성을 텍스트로 변환할 수 있는 강력한 기능을 제공합니다.
                    </p>
                    <button
                      onClick={() => navigate(`/feature-${item}`)}
                      className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      자세히 보기
                    </button>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
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
