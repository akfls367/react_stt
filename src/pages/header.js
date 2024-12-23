import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white text-black py-4 px-6 flex justify-between items-center shadow-md">
      <div 
        className="text-lg font-bold cursor-pointer hover:cursor-pointer"
        onClick={() => navigate("/")}
      >
        (KO) my project
      </div>
      <nav className="space-x-6 ">
        <a href="#github" className="hover:underline">가이드</a>
        <a href="#pricing" className="hover:underline">요금제</a>
        <a href="#faq" className="hover:underline">자주 묻는 질문</a>
        <Link to="/loginPage" className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600">로그인</Link>
      </nav>
    </header>
  );
};

export default Header;
