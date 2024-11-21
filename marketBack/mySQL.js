//npm i mysql2 --s
//1. 연결 풀>: mysql.createPool()을 사용해 연결 풀을 생성
//   자동 연결 관리: 풀에서 연결을 자동으로 관리하며 연결의 재사용 및 종료를 처리함
//2. 쿼리 실행: pool.query 메서드를 사용하여 쿼리를 실행. 연결 풀을 사용하기 때문에 연결과리가 자동으로 이뤄짐
//3. 오류 처리: 연결 설정중 오류가 발생하면 코콘솔에 로그를 남김

//const express = require("express");
//const cors = require("cors"); //다른 도메인 간 요청을 허용하기 위한 미들웨이 패키지
//const mysql = require("mysql2/promise"); // promise 기반 api를 사용해 비동기적으로 mysql 데이터베이스와 상호작용

//mysql2의 promise API 사용
//require("dotenv").config(); //.env 파일에 저장된 환경변수를 로드

//const app = express(); //express 어플리케이션 객체를 생성
//const port = process.env.PORT || 3333; // 환경변수 port를 가져와 사용하며 PORT번호 만약 없다면 3333 쓰겠습니다

//미들웨어 설정
//app.use(cors()); //cors 미들웨어 사용하여 교차 출처 자원 공유를 허용
//app.use(express.json()); // JSON 형식의 요청  본문을 자동으로 파싱하도록 설정
//app.use(express.urlencoded({ extended: false })); // URL-encoded 데이터의 파싱을 지원하며, extended: false는 기본쿼리스트링 라이브러리를 사용함을 뜻함

// //mySQL 커넥션 풀 설정
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "1234",
//   port: 3306,
//   database: "markets",
//   connectionLimit: 10, //최대 커넥션 수: 10개 미리 준비한다.
//   waitForConnections: true,
// });

// app.get("/", async (req, res) => {
//   const sql = `select * from markets`;
//   try {
//     const [data] = await pool.query(sql);
//     res.send(data);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// app.listen(port, () => {
//   console.log(`http://localhost:${port}`);
// });
