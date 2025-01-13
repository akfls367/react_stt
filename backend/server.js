const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const authController = require("./controllers/authController");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5000;

// CORS 허용
app.use(cors());
app.use(bodyParser.json());

// 라우트 설정
app.post("/api/register", authController.register);
app.post("/api/login", authController.login);

// 서버 실행
// app.listen(PORT, () => {
//   console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
// });

// 파일 저장 설정
const upload = multer({ dest: "uploads/" });

// AssemblyAI API 키
const ASSEMBLYAI_API_KEY = "806519efd46041ecbb6ef19918bd1503"; // 여기에 AssemblyAI API 키를 입력하세요.

// MP3 파일 업로드 및 처리 엔드포인트
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Step 1: AssemblyAI로 파일 업로드
    const uploadResponse = await axios({
      method: "POST",
      url: "https://api.assemblyai.com/v2/upload",
      headers: { authorization: ASSEMBLYAI_API_KEY },
      data: fs.createReadStream(filePath),
    });

    // Step 2: AssemblyAI에 텍스트 변환 요청
    const transcriptResponse = await axios({
      method: "POST",
      url: "https://api.assemblyai.com/v2/transcript",
      headers: { 
        authorization: ASSEMBLYAI_API_KEY,
        "Content-Type": "application/json"
      },
      data: {
        audio_url: uploadResponse.data.upload_url,
        language_code: "ko" // 한국어로 설정
      },
    });

    // Step 3: 변환 완료 시 결과 조회
    const { id } = transcriptResponse.data;

    // Polling으로 텍스트 변환 완료 여부 확인
    let transcriptResult;
    while (true) {
      const result = await axios({
        method: "GET",
        url: `https://api.assemblyai.com/v2/transcript/${id}`,
        headers: { authorization: ASSEMBLYAI_API_KEY },
      });

      if (result.data.status === "completed") {
        transcriptResult = result.data.text;
        break;
      } else if (result.data.status === "failed") {
        return res.status(500).json({ error: "STT 실패" });
      }

      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3초 대기
    }

    // 결과 반환
    res.json({ transcription: transcriptResult });

    // 임시 파일 삭제
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Error during transcription:", error.message);
    res.status(500).json({ error: "파일 처리 중 문제가 발생했습니다." });
  }
});

// 이메일 전송 라우트 -- 네이버 앱 비밀번호 확인해야함.
app.post("/send-email", async (req, res) => {
  const { firstName, email, phone, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }

  // 이메일 전송 설정
  const transporter = nodemailer.createTransport({
    host: "smtp.naver.com", // 네이버 SMTP 서버 주소
    port: 465, // SSL 포트
    secure: true, // SSL 사용
    auth: {
      user: "akfls367@naver.com", // 본인 이메일
      pass: "", // 이메일 비밀번호 또는 앱 비밀번호
    },
  });

  const mailOptions = {
    from: "akfls367@naver.com",
    to: "akfls367@naver.com", // 수신 이메일
    subject: `문의사항: ${firstName}`,
    text: `이름: ${firstName}\n이메일: ${email}\n전화번호: ${phone || "미입력"}\n메시지: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "이메일이 성공적으로 전송되었습니다." });
  } catch (error) {
    console.error("이메일 전송 오류:", error);
    res.status(500).json({ error: "이메일 전송에 실패했습니다." });
  }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
