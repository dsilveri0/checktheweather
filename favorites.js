let contador = 0;
let favoritesList = [];

window.onload = () => {

    insertCitiesFromLocalStorage();
    checkForFavorites()
}

function getWeatherByID(id) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&appid=5cccb144e99fcd50583cc21521086247&lang=pt`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);

                fillFieldsMainPage(json);

            } else {
                console.log('error msg: ' + req.status);
            }
        }
    }
    req.send();
}

function fillFieldsMainPage(data) {
    if (contador != 0) {

        let icon = data.weather[0].icon;

        creatorTemplateCards();

        document.querySelector(`.detailsButtonMP${contador-1}`).addEventListener("click", sendDataToDetails(data));
        document.querySelector(`.forecastButtonMP${contador-1}`).addEventListener("click", sendDataToForecast(data));

        document.getElementById(`city${contador-1}`).innerHTML = `${data.name} <span style="font-size: 16px;">(${data.sys.country})</span>`;
        document.getElementById(`icon${contador-1}`).setAttribute("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);
        document.getElementById(`temp${contador-1}`).innerHTML = data.main.temp.toFixed(0) + " ºC";
        document.getElementById(`weather-description${contador-1}`).innerHTML = data.weather[0].description;
        
        
        let index = document.querySelector(`.downAngle${contador-1}`).classList[4];
        document.getElementById(`idOfCity${index}`).value = data.id;

        document.querySelector(`.deleteButtonMP${index}`).addEventListener("click", () => {
            let myId = document.getElementById(`idOfCity${index}`).value;
            let retrievedData = localStorage.getItem("favoritesList");
            let favoritesStorage = JSON.parse(retrievedData);
            
            for(let j = 0; j < favoritesStorage.length; j++) {
                if(favoritesStorage[j] == myId) {
                    favoritesStorage.splice(j, 1);
                    contador = contador - 1;
                    console.log(contador)
                    checkForFavorites()
                }
            }
            localStorage.setItem("favoritesList", JSON.stringify(favoritesStorage));
            document.getElementById(`cardNumber${index}`).style.display = "none";
        });

        document.querySelector(`.buttonGroupCardsDIV${contador-1}`).style.display = "none";
        addEventListenerToBtns();
    }
}

function sendDataToDetails(data) {
    return function() {
        sessionStorage.setItem("cityIdDetails", data.id);
        window.location = ("details.html");
    }
}

function sendDataToForecast(data) {
    return function() {
        sessionStorage.setItem("cityIdForecast", data.id);
        window.location = ("forecast.html");
    }
}

function addEventListenerToBtns() {
    let downButtons = document.getElementsByClassName("downAngle");
    let upButtons = document.getElementsByClassName("upAngle");
    
    for(let i = 0; i < downButtons.length; i++){ 
        downButtons[i].addEventListener("click", makeButtonsAppear);
        upButtons[i].addEventListener("click", makeButtonsDisappear);
    }
}

function makeButtonsAppear() {
    let number = this.classList[4];
    document.querySelector(`.buttonGroupCardsDIV${number}`).style.display = "";
    document.querySelector(`.upAngle${number}`).style.display = "";
    document.querySelector(`.downAngle${number}`).style.display = "none";
}

function makeButtonsDisappear() {
    let number = this.classList[4];
    document.querySelector(`.buttonGroupCardsDIV${number}`).style.display = "none";
    document.querySelector(`.upAngle${number}`).style.display = "none";
    document.querySelector(`.downAngle${number}`).style.display = "";
}

// insert cities from favorites, which are set on the main page
function insertCitiesFromLocalStorage() {
    if(localStorage.getItem("favoritesList") != null) {
        let retrievedData = localStorage.getItem("favoritesList");
        let favoritesStorage = JSON.parse(retrievedData);

        for(let i = 0; i<favoritesStorage.length; i++) {
            contador = contador + 1;
            getWeatherByID(favoritesStorage[i]);
        }
    } else {
        checkForFavorites()
    }
}

function checkForFavorites() {
    if(contador == 0) {
        let noFavoritesYet = `
            <div class="col-xs col-sm col-md text-center" style="margin-bottom: 30px;">           
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Parece que ainda não tens favoritos :(</h4>
                        <p class="card-text">Clica <a href="index.html">AQUI</a> para começares!</p>
                    </div>
                </div>
            </div>
        `;
        document.querySelector(".testingDiv").innerHTML = noFavoritesYet;
    }
}

function creatorTemplateCards() {

let newElement = `
    <div id="cardNumber${contador}" class="col-xs col-sm-6 col-md-4" style="margin-bottom: 30px;">           
        <div class="card citycard text-center ${contador}">
            <div class="card-body">
                <h4 id="city${contador}" class="card-title"></h4>
                <img id="icon${contador}" src="">
                <p id="temp${contador}" class="card-text"></p>
                <p id="weather-description${contador}" class="card-text"></p>
                <i class="fas fa-angle-double-down fa-2x downAngle ${contador} downAngle${contador}"></i>
                <i class="fas fa-angle-double-up fa-2x upAngle ${contador} upAngle${contador}" style="display: none"></i>
                
                <div class="buttonGroupCardsDIV${contador} buttonsDIV" style="display:"";">
                    <div class="row">
                        <div class="col-xs col-sm col-md col-lg detailsDIV">
                            <a class="buttonGroupCards detailsButtonMP ${contador} detailsButtonMP${contador}">Detalhes</a>
                        </div>
                        <div class="col-xs col-sm col-md col-lg forecastDIV">
                            <a class="buttonGroupCards forecastButtonMP ${contador} forecastButtonMP${contador}">Forecast</a>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs col-sm col-md col-lg deleteDIV${contador}">
                            <a class="buttonGroupCards deleteButtonMP ${contador} deleteButtonMP${contador}">Remover</a>
                            <input id="idOfCity${contador}" type="hidden" value="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    contador = contador + 1;
    document.querySelector(".testingDiv").insertAdjacentHTML("beforeend", newElement);
}
