const url = `http://localhost:7778/markets`;
//서버로부터 데이터를 비동기로 가져오기
async function showList() {
  try {
    const response = await fetch("http://localhost:7778/markets"); // 데이터 가져올때까지 기다림
    const markets = await response.json(); // json으로 변환할때까지 기다림.
    //const features = markets.features; // json 데이터에서 속성값 추출해 features 변수에 저장
    //필요한 데이터를 HTML에 표시하기
    renderMarket(markets);
    const tbody = document.querySelector("tbody.tbody"); //getelementbyid로 html 문서에서 id가 market-list인 요소를 선택
    if (markets && Array.isArray(markets)) {
      markets.forEach((market, index) => {
        //새로운 행(tr) 생성
        const row = document.createElement("tr");
        //새로운 셀(td) 생성 및 데이터 추가
        const idCell = document.createElement("td");
        idCell.textContent = market.id; // no컬럼에 index +1

        const periodCell = document.createElement("td");
        periodCell.textContent = market.period || "정보 없음";

        const nameCell = document.createElement("td");
        nameCell.textContent = market.name || "정보 없음";

        const telCell = document.createElement("td");
        telCell.textContent = market.tel || "정보 없음";

        //셀을 행에 추가
        row.appendChild(idCell);
        row.appendChild(periodCell);
        row.appendChild(nameCell);
        row.appendChild(telCell);

        //행을 tbody에 추가
        tbody.appendChild(row);
      });
    } else {
      console.error("Invalid data format", markets);
    }
  } catch (error) {
    console.error("Error fetching markets:", error);
  }
}

//const market = feature.attributes; //attributes 객체 추출
//const listItem = document.createElement("li");
//listItem.innerHTML = `${market.name} ${market.tel}`;
//showList.appendChild(listItem);
//     }); // features 배열 순회하여 각 feature 객체 처리
//     // attributes 객체 추출
//     // document에 list 요소 생성
//     //listItem의 INNERhtml에 에 name과 tel을 설정해
//     //appendchild를 통해 listItem을 market-list 요소에 추가해
//   } catch (error) {
//     console.error("Error fetching markets: ", error);
//   }
// }

// 시장 검색하기
const findMarket = async (name) => {
  alert(name);
  try {
    const url2 = `http://localhost:7778/markets/search?name=${encodeURIComponent(
      name
    )}`;
    const response = await fetch(url2);
    const data = await response.json();
    renderMarket(data);
  } catch (error) {
    console.error("Error reddering market", error);
  }
};

//검색한 시장 정보 나오게 하기
const renderMarket = (data) => {
  const result = document.querySelector("tbody.tbody");
  result.innerHTML = ``;
  for (const market of data) {
    const str = `<tr>
    <td>${market.id}</td>
    <td>${market.period}</td>
    <td>${market.name}</td>
    <td>${market.tel}</td>
    <td>
        <button class="btn btn-info btn-sm" onclick="viewDetails('${market.id}')">상세보기</button>
      </td>
    </tr>`;
    result.innerHTML += str;
  }
};

//----------------------------------------------
//UI 부문
const searchBtn = document.querySelector(`.searchBtn`);
searchBtn.onclick = () => {
  let name = document.getElementById("searchInput").value;
  if (!name) {
    alert("검색할 시장명을 입력하세요");
    document.getElementById("searchInput").focus();
    return;
  }
  findMarket(name);
};

const detailBtn = document.querySelector(`.detailBtn`);
searchBtn.onclick = () => {
  let name = document.getElementById("searchInput").value;
  if (!name) {
    alert("검색할 시장명을 입력하세요");
    document.getElementById("searchInput").focus();
    return;
  }
  findMarket(name);
};

//상세보기 버튼 클릭시 팝업창에 띄우고 데이터 표시하기
const viewDetailsBtn = async (id) => {
  try {
    const response = await fetch(`http://localhost:7778/markets/${id}`);
    const market = await response.json();

    //팝업창에 데이터 표시
    document.getElementById("popup-name").textContent = market.name;
    document.getElementById("popup-period").textContent = market.period;
    document.getElementById("popup-tel").textContent = market.tel;
    document.getElementById("popup-addr").textContent = market.roadaddr;
    document.getElementById("popup-hmpgaddr").textContent = market.hmpg_addr;

    //팝업창 열기
    document.getElementById("popup").style.display = "flex";
  } catch (error) {
    console.error("Error fetching market details", error);
  }
};

//  팝업창 닫기 함수
const closePopup = () => {
  document.getElementById("popup").style.display = "none";
};

//페이지가 완전히 로드되었을때  showlist 함수 가져옴
document.addEventListener("DOMContentLoaded", showList);
