import React, { useState } from "react";
import { useNavigate} from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "test@example.com" && password === "password123") {
      alert("로그인 성공!");
      navigate("/home"); // 로그인 성공 시 이동할 페이지
    } else {
      alert("잘못된 이메일 또는 비밀번호입니다.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white text-black py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-lg font-bold cursor-pointer hover:cursor-pointer" onClick={() => navigate("/")}>
          (KO) my project
        </div>
      </header>

      {/* 로그인 영역 */}
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="w-96 p-8 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">로그인</h1>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            로그인
          </button>
          <div className="mt-4 text-sm">
            <a
              href="/signUpPage"
              className="text-blue-500 hover:underline"
            >
              회원가입
            </a>
          </div>
        </div>
      </div>
    </div>

  );
};

export default LoginPage;
