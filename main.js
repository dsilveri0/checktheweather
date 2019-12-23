let contador = 0;

window.onload = () => {
    getWeather("lisboa", "pt", true);
    getWeather("porto", "pt", true);

    document.querySelector(".search-bar-city").addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("button-addon2").click();
        }
    });
    document.querySelector(".search-bar-city").value = "";
}

function getWeather(city, country, verifier) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=5cccb144e99fcd50583cc21521086247&lang=pt`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);

                verifier ? fillFieldsMainPage(json) : "";

            } else {
                console.log('error msg: ' + req.status);
            }
        }
    }
    req.send();
}

function fillFieldsMainPage(data) {
    if (contador < 6) {
        let icon = data.weather[0].icon;

        creatorTemplateCards();
        
        console.log("THIS IS THE COUNTER: " + contador);
        document.getElementById(`city${contador-1}`).innerHTML = data.name;
        document.getElementById(`icon${contador-1}`).setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
        document.getElementById(`temp${contador-1}`).innerHTML = data.main.temp.toFixed(0) + " ºC";
        document.getElementById(`weather-description${contador-1}`).innerHTML = data.weather[0].description;

    }
    // Criar sistema para notificar o utilizador caso não tenha mais espaços disponiveis para adicionar cidades.
}

function findCity(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/find?q=${city}&units=metric&appid=5cccb144e99fcd50583cc21521086247&cnt=5&lang=pt`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);

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
    spawnSearchResults()

    let contentVerifier = document.querySelector(".searchList").innerHTML;

    if (data.count != 0) {
        if(contentVerifier == "") {
            
            callFillAndAddListener(data);
        
        } else if(contentVerifier != ""){
            
            callFillAndAddListener(data);

        }
    } else if (data.count == 0) {
        document.querySelector(".searchList").innerHTML = `<p id="notFound" class="groupData">Cidade não encontrada!</p>`;
    }
}

function callFillAndAddListener(data) {
    clearSearchResults('groupData');
    fillFieldsSearchResults(data);
    
    favorite = document.querySelector(".homeBtn");
    favorite == null || favorite == undefined ? favorite = "" : favorite.addEventListener("click", insertCityOnFavorites);
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
                            <img style="margin:auto;" src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png">
                        </div>
                    </div>
                    <div class="col-xs-7 col-sm-6 col-md-7 col-lg-8">
                        <div class="groupData style="margin:auto;"">
                            <p id="cityCountry5">${data.list[i].name}, ${data.list[i].sys.country} (Lat: ${data.list[i].coord.lat}, Lon: ${data.list[i].coord.lon})</p>
                            <p id="temp5">Temperatura: ${data.list[i].main.temp.toFixed(0)} ºC</p>
                            <p id="description5">Previsão: ${data.list[i].weather[0].description}</p>
                        </div>
                    </div>
                    <div class"col-xs-2 col-sm-3 col-md-2 col-lg-2 groupData" style="margin:${marginStar} auto;">
                        <i class="fas fa-home fa-2x center groupData homeBtn" style="margin:auto;"></i>
                        <i class="far fa-star fa-2x center groupData favBtn" style="margin:auto;"></i>
                    </div>
                </div>
            </div>
        `;
        document.querySelector(".searchList").insertAdjacentHTML('beforeend', searchResult);
    }
}

function insertCityOnFavorites() {

    data = document.querySelector(".homeBtn").parentNode.parentNode.previousSibling.nextElementSibling.innerText;
    
    let city = data.split(',').slice(0,1)
    let country = data.split(' ').slice(1,2)

    //console.log(`${city}, ${country}`);

    getWeather(city, country, true);

}

function addDataToStorage() {
// Adds data on localstorage, i.e: the cities on the main page, and the cities on the favorites tab.
// May be called when adding a city to the main page, and or the favorites tab.



}

function removeDataFromStorage() {
// Removes data on localstorage, i.e: the cities on the main page, and the cities on the favorites tab.
// May be called when deleting cites from the local storage.

}

function creatorTemplateCards() {

let newElement = `
    <div class="col-xs col-sm-6 col-md-4" style="margin-bottom: 30px;">           
        <div class="card citycard text-center">
            <div class="card-body">
                <h4 id="city${contador}" class="card-title"></h4>
                <img id="icon${contador}" src="">
                <p id="temp${contador}" class="card-text"></p>
                <p id="weather-description${contador}" class="card-text"></p>
            </div>
        </div>
    </div>
    `
    contador = contador + 1;
    document.querySelector(".testingDiv").insertAdjacentHTML("beforeend", newElement);
}

function clearSearchResults(className) {
    let elem = document.getElementsByClassName(className);

    while(elem[0]) {
        elem[0].parentNode.removeChild(elem[0]);
    }
}
