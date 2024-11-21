//1. 필요한 모듈 설치
const express = require("express");
const router = express.Router();
const axios = require("axios");
const cors = require("cors");
const mysql = require("mysql2/promise");

//2. Express 애플리케이션 인스턴스 생성
const app = express();
//3. 미들웨어 설정
app.use(cors());

//4. mySQL 커넥션 풀 설정
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  port: 3306,
  database: "markets",
  connectionLimit: 10, //최대 커넥션 수: 10개 미리 준비한다.
  waitForConnections: true,
});

//5-1. 전통시장 api 호출 및 데이터 삽입
const savemarketdata = async () => {
  try {
    //axios 방식으로 모든 api 데이터를 가져오겠다는 말임.
    // query?where1%3D1 는 모든 데이터를 가져오겠다는 조건임.
    // outFields=*&outSR=4326&f=json**는 모든 필드를 가져오고, JSON 형식으로 데이터를 요청한다는 뜻
    const response = await axios.get(
      "https://smart.incheon.go.kr/server/rest/services/Hosted/전통시장/FeatureServer/47/query?where=1%3D1" +
        "&outFields=*&outSR=4326&f=json"
    );
    const markets = response.data.features;

    //데이터베이스에 데이터 저장하기 "insertQuery"는 mysql에 데이터 저장하는 쿼리임
    const insertQuery = `INSERT INTO markets(name, period, hmpg_addr, tel, roadaddr,x,y)
  VALUES(?,?,?,?,?,?,?)`;
    //mySQL 연결 및 트랜젝션 처리
    //pool.getConnection을 통해 mySQLconnetion 풀에서 연결을 가져옴
    const connection = await pool.getConnection();

    try {
      //트랜젝션 시작
      await connection.beginTransaction();
      //데이터 삽입 루프. for루프를 이용해 api에서 가져온 각 시장 데이터를 하나씩 처리함
      for (const market of markets) {
        const { name, period, hmpg_addr, tel, roadaddr } = market.attributes;
        const { x, y } = market.geometry;
        await connection.query(insertQuery, [
          name,
          period,
          hmpg_addr,
          tel,
          roadaddr,
          x,
          y,
        ]);
      }
      //트랜젝션 완료 처리
      await connection.commit();
      console.log("data successfully inserted into market table");
      //에러처리 및 롤백
    } catch (err) {
      await connection.rollback(); //데이터베이스 변경사항 취소
      console.error("Error inserting data: ", err.message);
    } finally {
      connection.release(); // mysql 연결을 풀에 반환함
    }
  } catch (error) {
    console.error("error fetching data from API:", error.message); //api에서 데이터 가져오는 도중 발생하는 에러 처리
  }
};

//5-2. 특정 엔드포인트를 호출하여 전통시장 데이터를 api로부터 가져와 mysql데이터베이스에 저장
router.get("/update-markets", async (req, res) => {
  try {
    await savemarketdata();
    res.send("Market data updated successfully");
  } catch (error) {
    res.status(500).send("Error updating market data: " + error.message);
  }
});

//6.전체 가져오기 라우트: 전체 시장정보 가져오기
router.get("/", async (req, res) => {
  //데이터베이스 쿼리 작성
  const sql = `select * from markets`;
  try {
    //데이터베이스 쿼리 실행
    const [data] = await pool.query(sql);
    //데이터를 json으로 반환
    res.status(200).json(data);
    //오류 발생시 500상태 코드와 오류메시지 반환
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//6.검색 라우트: 시장이름으로 sql에서 필터링하여 가져오기
router.get("/search", async (req, res) => {
  console.log("==========================");
  let { name } = req.query;
  console.log(name);
  if (!name) {
    return res.json([{ message: "검색어를 입력해야 해요" }]);
  }
  /**https://smart.incheon.go.kr/server/rest/services/Hosted/전통시장/FeatureServer/47/query?where=1%3D1&outFields=*&outSR=4326&f=json */

  //4.api url 생성
  // var api_url =
  //   "https://smart.incheon.go.kr/server/rest/services/Hosted/전통시장/FeatureServer/47/query?where=1%3D1" +
  //   "&outFields=*&outSR=4326&f=json";
  //- where 조건에 sql 스타일 조건문으로 작성해야 함

  //5. api 호출 및 데이터 처리
  // try {
  //   const response = await axios.get(api_url);
  //   //응답 데이터 받기
  //   const data = await response.data;
  //   res.status(200).json(data);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).send(error.message);
  // }

  try {
    //데이터베이스 쿼리 작성
    const sql = `select * from markets where name like ?`;
    //데이터베이스 쿼리 실행
    const [data] = await pool.query(sql, [`%${name}%`]);
    //데이터를 json으로 반환
    res.status(200).json(data);
    //오류 발생시 500상태 코드와 오류메시지 반환
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//삭제 라우트
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "시장id가 없습니다." });
  }
  const sql = `delete from book where id=?`;
  try {
    const [result] = await pool.query(sql, [id]);
    if (XPathResult.affectedRows === 0) {
      return res.json({ message: "삭제할 시장이 존재하지 않습니다." });
    } else {
      res.json({ message: `${name}시장을 삭제했습니다.` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//8. 라우터 모듈 내보내기
module.exports = router;
