import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password
      });
      alert(response.data.message);
    } catch (error) {
      console.error("로그인 실패:", error.response?.data?.error || error.message);
      alert("로그인 중 오류가 발생했습니다.");
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
