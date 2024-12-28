const bcrypt = require("bcrypt");
const db = require("../database/db_config");

// 회원가입 API
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 암호화
    const query = "INSERT INTO member (name) VALUES (?, ?, ?)";
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
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    res.status(200).json({ message: "로그인 성공!", user: { id: user.id, name: user.name, email: user.email } });
  });
};
