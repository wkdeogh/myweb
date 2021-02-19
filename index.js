// 배경을 변경하는 함수
async function setRenderBackground() {
    const result = await axios.get("https://picsum.photos/1280/720", {
        responseType: "blob" //이미지 사운드 등 타입을 다루기위한 객체형식(Binary large object)
    });
    const data = URL.createObjectURL(result.data); //데이터에 대한 임시 url을 만들어줌 (img태그에 쓰기위함)
    document.querySelector("body").style.backgroundImage = `url(${data})`; //배경 이미지 설정 (url사용)
}

// 시계 설정 함수
function setTime() {
    const timer = document.querySelector(".timer");
    setInterval(() => { // 무한반복
        const date = new Date();
        timer.textContent = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        setTimertext();
    }, 1000);
}

//***** 과제 *****//
// 굿모닝 굿애프터눈 굿이브닝
function setTimertext() {
    const timertext = document.querySelector(".timer-content");
    const time = document.querySelector(".timer").textContent; // 현재시간 가져옴
    if(time.split(':')[0] >= 18) timertext.textContent = "Good Evening, Daeho~"; //18시 이상일때
    else if (time.split(':')[0] >= 12) timertext.textContent = "Good Afternoon, Daeho~"; //12시~18시
    else timertext.textContent = "Good Morning, Daeho~"; //오전
}
//***************//

// 메모 불러오기
function getMemo() {
    const memo = document.querySelector(".memo");
    const memoValue = localStorage.getItem("todo");
    memo.textContent = memoValue;
}

// 메모 저장
function setMemo() {
    const memoInput = document.querySelector(".memo-input");
    memoInput.addEventListener("keyup", function (e) {
        if(e.code === 'Enter' && e.target.value) {
            localStorage.setItem("todo", e.target.value);
            getMemo();
            memoInput.value = "";
        }
    })
}

// 메모 삭제
function deleteMemo() {
    document.addEventListener("click", function (e) {
        if(e.target.classList.contains("memo")) {
            localStorage.removeItem("todo"); //localStorage item삭제
            e.target.textContent = ""; //memo html 비워주기
        }
    })
}

// 위도 경도 가져오기 -> Promise화
function getPosition(options) {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    })
}

// 날씨 가져오기
async function getWeather(latitude, longitude) {
    // 위도와 경도가 있는경우
    if(latitude && longitude) {
        const data = await axios.get(
            `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=8dd71f9d54f677d1f1f4bf3335b8efe9`
            );
        return data;
    }
    // 위도와 경도가 없는경우
    const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=8dd71f9d54f677d1f1f4bf3335b8efe9`);
    return data;
}

// 날씨 아이콘
function matchIcon(weatherData){
    if (weatherData === "Clear") return './images/039-sun.png';
    if (weatherData === "Clouds") return './images/001-cloud.png';
    if (weatherData === "Rain") return './images/003-rainy.png';
    if (weatherData === "Snow") return './images/006-snowy.png';
    if (weatherData === "Thunderstorm") return './images/008-storm.png';
    if (weatherData === "Drizzle") return './images/031-snowflake.png';
    if (weatherData === "Atmosphere") return './images/033-hurricane.png';
}

// 날씨 띄우기
function weatherWrapperComponent(li) {
    const changeToCelsius = (temp) => (temp - 273.15).toFixed(1); //소수첫번째자리
    return `
    <div class="card shadow-sm bg-transparent mb-3 m-2 flex-grow-1">
        <div class="card-header text-white text-center">
            ${li.dt_txt.split(" ")[0]}
        </div>
        <div class="card-body d-flex">
            <div class="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                <h5 class="card-title">
                    ${li.weather[0].main}
                </h5>
                <img src="${matchIcon(li.weather[0].main)}" width="60px" height="60px"/>
                <p class="card-text">${changeToCelsius(li.main.temp)}</p>
            </div>
        </div>
    </div>
    `
}

// 위도와 경도를 받아서 데이터를 받아오기
async function renderWeather() {
    let latitude = '';
    let longitude = '';
    try {
        const position = await getPosition();
        // console.log(position.coords);
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    } catch (error) {
        console.log(error);
    }
    const weatherResponse = await getWeather(latitude, longitude);
    const weatherData = weatherResponse.data;
    // console.log(weatherData);
    weatherList = weatherData.list.reduce((acc, cur) => { //날씨데이터에서 list 배열에 접근
        if(cur.dt_txt.indexOf("18:00:00") > 0){ //기준을 6시로 잡아서 그때의 데이터만 사용
            acc.push(cur);
        }
        return acc;
    }, [])

    //***** 과제 *****//
    const todayweather = weatherList[0].weather[0].main; //오늘날씨
    setmodalButton(todayweather); //모달 버튼 이미지 설정
    //***************//

    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = weatherList.map(li => {
        return weatherWrapperComponent(li);
    }).join("");
}

//***** 과제 *****//
// 모달 버튼 이미지
function setmodalButton(weather) { // 오늘 날씨 받아서 백그라운드이미지 바꾸기
    const modalButton = document.querySelector(".modal-button");
    modalButton.style.backgroundImage = `url(${matchIcon(weather)})`;
}
//***************//

// 8dd71f9d54f677d1f1f4bf3335b8efe9

(function () {
    setRenderBackground();
    setInterval(() => {
        setRenderBackground();
    }, 5000);
    setTime();
    setTimertext();

    setMemo();
    getMemo();
    deleteMemo();

    renderWeather();
    setmodalButton();
})();