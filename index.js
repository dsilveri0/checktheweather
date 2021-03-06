let contador = 0;
let resultsCont = 0;
let arrayMainPageData = [];
let arrayDefaultMpData = [];
let favoritesList = [];
let verifierForCities = 0;
 
if(localStorage.getItem("measureSystem") != null) {
    let retrievedData = localStorage.getItem("measureSystem");

    currentSystem = retrievedData[0].system;
    currentSign = retrievedData[0].signal;

} else {

    currentSystem = "metric";
    currentSign = document.querySelector(".measureButtonsC").textContent;

}

document.querySelector(".measureButtonsC").addEventListener("click", () => {

    let currentSystem = [{system: "metric", signal: "ºC"}]
    localStorage.setItem("measureSystem", JSON.stringify(currentSystem));
});

document.querySelector(".measureButtonsF").addEventListener("click", () => {
    let currentSystem = [{system: "imperial", signal: "ºF"}]
    localStorage.setItem("measureSystem", JSON.stringify(currentSystem));
});


window.onload = () => {
    
    let lisboa = 2267057;
    let porto = 2735943;

    getWeather(lisboa, true);
    getWeather(porto, true);

    document.querySelector(".search-bar-city").addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            resultsCont = 0;
            event.preventDefault();
            document.getElementById("button-addon2").click();
        }
    });
    document.querySelector(".search-bar-city").value = "";

    $('.modal').on('hidden.bs.modal', () => {
        verifierForCities = 0;
    })

    insertCitiesFromLocalStorage();
}

(function(cityID1, cityID2){
    let defaultsMainPage = [{city: "lisboa", id: cityID1}, {city: "porto", id: cityID2}];

    arrayDefaultMpData.push(defaultsMainPage);
    localStorage.setItem("defaultMainPageCities", JSON.stringify(arrayDefaultMpData));
})(2267057, 2735943);

function getWeather(id, verifier) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&appid=5cccb144e99fcd50583cc21521086247&lang=pt`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);

                verifier ? defaultItemsMainPage(json) : "";

            } else {
                console.log('error msg: ' + req.status);
            }
        }
    }
    req.send();
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


function defaultItemsMainPage(data) {
    if (contador < 6) {
        let icon = data.weather[0].icon;

        creatorTemplateCards();

        if(localStorage.getItem("favoritesList") != null) {
            let retrievedData = localStorage.getItem("favoritesList");
            let favoritesStorage = JSON.parse(retrievedData);

            for(let i = 0; i<favoritesStorage.length; i++) {
                if(data.id == favoritesStorage[i]) {
                    document.querySelector(`.mpfavBtn${contador-1}`).style.display = '';
                    document.querySelector(`.nmpfavBtn${contador-1}`).style.display = 'none';
                }      
            }
        }
        
        document.querySelector(`.nmpfavBtn${contador-1}`).addEventListener("click", (index) => {
            insertCitiesOnFavorites(data.id)
            console.log(index.toElement.classList[4])
            let btnIndex = index.toElement.classList[4];
            let hiddenIndex = btnIndex.slice(1)

            document.querySelector(`.${hiddenIndex}`).style.display = '';
            document.querySelector(`.${btnIndex}`).style.display = 'none';
        });

        document.querySelector(`.detailsButtonMP${contador-1}`).addEventListener("click", sendDataToDetails(data));
        document.querySelector(`.forecastButtonMP${contador-1}`).addEventListener("click", sendDataToForecast(data));

        document.querySelector(`.deleteDIV${contador-1}`).style.display = "none";
        document.querySelector(`.buttonGroupCardsDIV${contador-1}`).style.display = "none";
        document.getElementById(`city${contador-1}`).innerHTML = `${data.name} <span style="font-size: 16px;">(${data.sys.country})</span>`;
        document.getElementById(`icon${contador-1}`).setAttribute("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);
        document.getElementById(`temp${contador-1}`).innerHTML = data.main.temp.toFixed(0) + " ºC";
        document.getElementById(`weather-description${contador-1}`).innerHTML = data.weather[0].description;

        addEventListenerToBtns();
    }
}



function fillFieldsMainPage(data) {
    if (contador < 6) {
        let icon = data.weather[0].icon;

        creatorTemplateCards();

        if(localStorage.getItem("favoritesList") != null) {
            let retrievedData = localStorage.getItem("favoritesList");
            let favoritesStorage = JSON.parse(retrievedData);

            for(let i = 0; i<favoritesStorage.length; i++) {
                if(data.id == favoritesStorage[i]) {
                    document.querySelector(`.mpfavBtn${contador-1}`).style.display = '';
                    document.querySelector(`.nmpfavBtn${contador-1}`).style.display = 'none';
                }      
            }
        }
        
        document.querySelector(`.nmpfavBtn${contador-1}`).addEventListener("click", (index) => {
            insertCitiesOnFavorites(data.id)
            console.log(index.toElement.classList[4])
            let btnIndex = index.toElement.classList[4];
            let hiddenIndex = btnIndex.slice(1)

            document.querySelector(`.${hiddenIndex}`).style.display = '';
            document.querySelector(`.${btnIndex}`).style.display = 'none';
        });

        document.querySelector(`.detailsButtonMP${contador-1}`).addEventListener("click", sendDataToDetails(data));
        document.querySelector(`.forecastButtonMP${contador-1}`).addEventListener("click", sendDataToForecast(data));

        document.getElementById(`city${contador-1}`).innerHTML = `${data.name} <span style="font-size: 16px;">(${data.sys.country})</span>`;
        document.getElementById(`icon${contador-1}`).setAttribute("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);
        document.getElementById(`temp${contador-1}`).innerHTML = data.main.temp.toFixed(0) + " ºC";
        document.getElementById(`weather-description${contador-1}`).innerHTML = data.weather[0].description;
        
        if(data.id != arrayDefaultMpData[0][0].id || data.id != arrayDefaultMpData[0][1].id) {
            let index = document.querySelector(`.downAngle${contador-1}`).classList[4];
            document.getElementById(`idOfCity${index}`).value = data.id;

            document.querySelector(`.deleteButtonMP${index}`).addEventListener("click", () => {
                let myId = document.getElementById(`idOfCity${index}`).value;
                let retrievedData = localStorage.getItem("mainPageCities");
                let citiesStorage = JSON.parse(retrievedData);
                
                for(let j = 0; j < citiesStorage.length; j++) {
                    if(citiesStorage[j].Id == myId) {
                        citiesStorage.splice(j, 1);
                        verifierForCities = 0;
                    }
                }
                localStorage.setItem("mainPageCities", JSON.stringify(citiesStorage));
                document.getElementById(`cardNumber${index}`).style.display = "none";
            });
        }
        document.querySelector(`.buttonGroupCardsDIV${contador-1}`).style.display = "none";


        addMainPageDataToStorage(data.name, data.sys.country, data.id);

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

function insertCitiesFromLocalStorage() {
    let retrievedData = localStorage.getItem("mainPageCities");
    let citiesStorage = JSON.parse(retrievedData);

    if (citiesStorage != null) {
        for(let i = 0; i < citiesStorage.length; i++) {
            getWeatherByID(citiesStorage[i].Id);
        }
    }
}

function findCity(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/find?q=${city}&units=metric&appid=5cccb144e99fcd50583cc21521086247&cnt=5&lang=pt`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);

                for(let i = 0; i < json.count; i++) {
                    if(json.list[i].id === arrayDefaultMpData[0][0].id || json.list[i].id === arrayDefaultMpData[0][1].id) {
                        json.list.splice(i, 1);
                        json.count--;
                        verifierForCities = 1;
                    }

                    for(let k = 0; k < arrayMainPageData.length; k++) {
                        if(json.count != 0 && typeof json.list != "undefined") {
                            if(json.list[i].id === arrayMainPageData[k].Id) {
                                json.list.splice(i, 1);
                                json.count--;
                                verifierForCities = 1;
                            }
                        }
                    }
                }

                displaySearchResults(json);

            } else {
                console.log('error msg: ' + req.status);
            }
        }
    }
    req.send();
}

function searchBar() {
    let search;

    search = document.querySelector(".search-bar-city").value;
    findCity(search);
}
document.querySelector(".search-button-city").addEventListener("click", searchBar);

function spawnSearchResults() {
    $('.modal').modal('show');
}


function displaySearchResults(data) {
    resultsCont = 0;
    spawnSearchResults()

    let contentVerifier = document.querySelector(".searchList").innerHTML;

    if (data.count != 0) {
        if(contentVerifier == "") {
            
            callFillAndAddListener(data);
        
        } else if(contentVerifier != ""){
            callFillAndAddListener(data);
                if(verifierForCities != 0) {
                    document.querySelector(".searchList").insertAdjacentHTML("afterbegin", `
                        <p id="notFound" class="groupData alert alert-info" style="text-align: center; margin: 25px;">Alguns resultados foram omitidos.</p>
                    `)
                }
        }
    } else if (data.count === 0) {
        if (verifierForCities === 0) {
            document.querySelector(".searchList").innerHTML = `<p id="notFound" class="groupData alert alert-danger" style="text-align: center; margin: 25px;">Cidade não encontrada!</p>`;
        } else {
            document.querySelector(".searchList").innerHTML = `<p id="notFound" class="groupData alert alert-success" style="text-align: center; margin: 25px;">Cidade já adicionada à página principal!</p>`;
        }
    }
}

function callFillAndAddListener(data) {
    clearSearchResults('groupData');
    fillFieldsSearchResults(data);

    let resultsLength = document.getElementsByClassName("homeBtn");

    for(let i = 0; i < resultsLength.length; i++) {
        let eventButtonsSel = document.querySelector(`.homeBtn${i}`);
        let favButtonSel = document.querySelector(`.nfavBtn${i}`);
        
        if(localStorage.getItem("favoritesList") != null) {
            let retrievedData = localStorage.getItem("favoritesList");
            let favoritesStorage = JSON.parse(retrievedData);
            
            for(let k = 0; k<favoritesStorage.length; k++) {
                let values = document.getElementById(`searchResultsID${i}`).value;

                let id = "" +  values.split(", ").slice(2,3)
                if(id == favoritesStorage[k]) {
                    document.querySelector(`.favBtn${i}`).style.display = '';
                    document.querySelector(`.nfavBtn${i}`).style.display = 'none';
                }
            }
        }

        favButtonSel.addEventListener("click", () => {
            let values = document.getElementById(`searchResultsID${i}`).value;
            
            document.querySelector(`.favBtn${i}`).style.display = '';
            document.querySelector(`.nfavBtn${i}`).style.display = 'none';
            
            let city = "" + values.split(", ").slice(0,1)
            let country = "" +  values.split(", ").slice(1,2)
            let id = "" +  values.split(", ").slice(2,3)
            console.log(`${city},${country},${id}`)
            
            insertCitiesOnFavorites(id);

        });

        eventButtonsSel.addEventListener("click", () => {
            let values = document.getElementById(`searchResultsID${i}`).value;
            let id = values.split(", ").slice(2,3)

            getWeatherByID(id);
            $('.modal').modal('hide');

        });
    }
}

function insertCitiesOnFavorites(id) {
    if(localStorage.getItem("favoritesList") != null) {
        let retrievedData = localStorage.getItem("favoritesList");
        let favoritesStorage = JSON.parse(retrievedData);
        
        favoritesList.push(id);
        favoritesStorage.push(id);

        let unique = [...new Set(favoritesStorage)];
        
        localStorage.setItem("favoritesList", JSON.stringify(unique));
    } else {
        favoritesList.push(id);
        localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
    }
}

function fillFieldsSearchResults(data) {
    let innerWith = window.innerWidth;
    let marginStar;
    
    for(let i = 0; i<data.list.length; i++) {
        
        innerWith > 575 ? marginStar = "auto" : marginStar = "15px";

        let searchResult = `
            <div class="searchResults">
                <div class="row groupData" style="border-bottom: 1px solid #A9A9A9">
                    <div class="col-xs-3 col-sm-3 col-md-3 col-lg-2">
                        <div class="groupData">
                            <img style="margin:auto;" src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png">
                        </div>
                    </div>
                    <div class="col-xs-7 col-sm-6 col-md-7 col-lg-8">
                        <div class="groupData style="margin:auto;"">
                            <p id="cityCountry${resultsCont}">${data.list[i].name}, ${data.list[i].sys.country}</p>
                            <p id="temper${resultsCont}">Temperatura: ${data.list[i].main.temp.toFixed(0)} ºC</p>
                            <p id="description${resultsCont}">Previsão: ${data.list[i].weather[0].description}</p>
                        </div>
                    </div>
                    <div class"col-xs-2 col-sm-3 col-md-2 col-lg-2 groupData" style="margin:${marginStar} auto;">
                        <i class="fas fa-home fa-2x center groupData buttonsResults homeBtn homeBtn${resultsCont}"></i>
                        <i style="display: none" class="fas fa-star fa-2x center groupData buttonsResults favBtn favBtn${resultsCont}"></i>
                        <i class="far fa-star fa-2x center groupData buttonsResults nfavBtn nfavBtn${resultsCont}"></i>

                        <input type="hidden" id="searchResultsID${resultsCont}" value="${data.list[i].name}, ${data.list[i].sys.country}, ${data.list[i].id}">
                    </div>
                </div>
            </div>
        `;
        resultsCont = resultsCont + 1;
        document.querySelector(".searchList").insertAdjacentHTML('beforeend', searchResult);
    }
}

function addMainPageDataToStorage(cityName, countryName, cityID) {

    let jsObj = {city: cityName, country: countryName, Id: cityID};

    arrayMainPageData.push(jsObj);
    localStorage.setItem("mainPageCities", JSON.stringify(arrayMainPageData));

}

function creatorTemplateCards() {

let newElement = `
    <div id="cardNumber${contador}" class="col-xs col-sm-6 col-md-4" style="margin-bottom: 30px;">           
        <div class="card citycard text-center ${contador}">
            <div class="card-body">
                <i style="display: none" class="fas fa-star fa-2x mpfavBtn mpfavBtn${contador}"></i>
                <i class="far fa-star fa-2x nmpfavBtn nmpfavBtn${contador}"></i>
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

function clearSearchResults(className) {
    let elem = document.getElementsByClassName(className);

    while(elem[0]) {
        elem[0].parentNode.removeChild(elem[0]);
    }
}