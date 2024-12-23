import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    if (name && email && password) {
      alert("회원가입 성공!");
      navigate("/loginPage"); // 회원가입 후 로그인 페이지로 이동
    } else {
      alert("모든 정보를 입력해주세요.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white text-black py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-lg font-bold cursor-pointer hover:cursor-pointer" onClick={() => navigate("/")}>
          (KO) my project
        </div>
      </header>

      {/* 회원가입 영역 */}
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="w-96 p-10 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-6">회원가입</h1>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSignUp}
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            회원가입
          </button>
          <div className="mt-4 text-sm">
            <a
              href="/loginPage"
              className="text-blue-500 hover:underline"
            >
              이미 계정이 있으신가요? 로그인
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
