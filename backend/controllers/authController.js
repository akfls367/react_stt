const bcrypt = require("bcrypt");
const db = require("../database/db_config");

// 회원가입 API
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // 모든 필드가 입력되었는지 확인
  if (!name || !email || !password) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }

  try {
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);
    // SQL 쿼리 수정: name, email, hashedPassword 열 추가
    const query = "INSERT INTO member (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("회원가입 실패:", err.message);
        return res.status(500).json({ error: "회원가입 중 오류가 발생했습니다." });
      }
      res.status(201).json({ message: "회원가입 성공!" });
    });
  } catch (err) {
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
};


// 로그인 API
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 입력값 유효성 검사
  if (!email || !password) {
    return res.status(400).json({ error: "이메일과 비밀번호를 모두 입력해주세요." });
  }

  try {
    // 사용자 조회
    const query = "SELECT * FROM member WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      console.log(results[0])

      if (err) {
        console.error("데이터베이스 오류:", err.message);
        return res.status(500).json({ error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "등록되지 않은 이메일이거나 비밀번호가 잘못되었습니다." });
      }

      const user = results[0];

      // 비밀번호 비교
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "등록되지 않은 이메일이거나 비밀번호가 잘못되었습니다." });
      }

      // 로그인 성공 응답
      res.status(200).json({
        message: "로그인 성공!",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    });
  } catch (err) {
    console.error("서버 오류:", err.message);
    res.status(500).json({ error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
  }
};

