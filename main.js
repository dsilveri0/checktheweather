window.onload = () => {
    getWeather("lisboa", "pt", "");
    getWeather("porto", "pt", "2");

    document.querySelector(".search-bar-city").value = "";
}

function getWeather(city, country, value) {
    const API_URL = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=5cccb144e99fcd50583cc21521086247&lang=pt`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);

                fillFieldsMainPage(json, value);

            } else {
                console.log('error msg: ' + req.status);
            }
        }
    }
    req.send();
}

function fillFieldsMainPage(data, i) {
    let icon = data.weather[0].icon;

    document.getElementById("temp"+i).innerHTML = data.main.temp.toFixed(0) + " ºC";
    document.getElementById("icon"+i).setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
    document.getElementById("weather-description"+i).innerHTML = data.weather[0].description;
    document.getElementById("city"+i).innerHTML = data.name;

}

function findCity(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/find?q=${city}&units=metric&appid=5cccb144e99fcd50583cc21521086247&cnt=5&lang=pt`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);

                console.log(json);
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

    if(contentVerifier == "") {

        fillFieldsSearchResults(data);
        
        favorite = document.querySelector(".favBtn");
        favorite == null || favorite == undefined ? favorite = "" : favorite.addEventListener("click", insertCityOnFavorites);

    } else {

        clearSearchResults('groupData');
        fillFieldsSearchResults(data);

        favorite = document.querySelector(".favBtn");
        favorite == null || favorite == undefined ? favorite = "" : favorite.addEventListener("click", insertCityOnFavorites);

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
                        <i class="far fa-star fa-2x center groupData favBtn" style="margin:auto;"></i>
                    </div>
                </div>
            </div>
        `;
        document.querySelector(".searchList").insertAdjacentHTML('beforeend', searchResult);
    }
}

function insertCityOnFavorites() {

    // Retrieving City name.
    data = document.querySelector(".favBtn").parentNode.parentNode.previousSibling.nextElementSibling.innerText;
    
    let city = data.split(',').slice(0,1)
    let country = data.split(' ').slice(1,2)

    console.log(city);
    console.log(country);

    getWeather(city, country, "6")

    let newElement = `
    <div class="card citycard text-center">
        <div class="card-body">
            <h4 id="city6" class="card-title"></h4>
            <img id="icon6" src="">
            <p id="temp6" class="card-text"></p>
            <p id="weather-description6" class="card-text"></p>
        </div>
    </div>
    `
    document.querySelector(".testingDiv").insertAdjacentHTML('afterbegin', newElement);
}

function clearSearchResults(className) {
    let elem = document.getElementsByClassName(className);

    while(elem[0]) {
        elem[0].parentNode.removeChild(elem[0]);
    }
}