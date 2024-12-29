const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const authController = require("./controllers/authController");

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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
