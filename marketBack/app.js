//1. 필요한 모듈 설치
const express = require("express");
const path = require("path"); //path.join 쓸려면 필요함
require("dotenv").config(); // env 파일 쓰기 위한 코드'
const cors = require("cors");
const axios = require("axios");
const mysql = require("mysql2/promise");

//2. router 불러오기
const marketRouter = require("./marketRouter"); //네이버 관련 api 처리하는 router 모듈 가져오기

//3. 포트 설정하기
const port = process.env.PORT || 3333;

//4. Express 애플리케이션 인스턴스 생성
const app = express();

//5. 미들웨어 설정
//app.js 파일에서 public 디렉토리를 정적 파일을 제공하는 디렉토리로 설정
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json()); // JSON 형식의 요청  본문을 자동으로 파싱하도록 설정
app.use(express.urlencoded({ extended: false })); // URL-encoded 데이터의 파싱을 지원하며, extended: false는 기본쿼리스트링 라이브러리를 사용함을 뜻함

//6. 라우트 설정하기
app.use("/markets", marketRouter); //marketRouter 경로에 대해 marketRouter을 사용함

//7.서버 시작
app.listen(port, () => {
  console.log(`http://localhost:${port}/markets`);
});
