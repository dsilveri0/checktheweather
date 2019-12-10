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

    } else {

        clearSearchResults('groupData');
        fillFieldsSearchResults(data);

    }
}

function fillFieldsSearchResults(data) {
    for(let i = 0; i<data.list.length; i++) {

        let searchResult = `
            <div class="searchResults">
                <div class="row">
                    <div class="col-xs-3 col-sm-2 col-md-2">
                        <div class="groupData">
                            <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png">
                        </div>
                    </div>
                    <div class="col-xs-9 col-sm-10 col-md-10">
                        <div class="groupData" style="border-bottom: 1px solid #A9A9A9">
                            <p id="cityCountry5">${data.list[i].name}, ${data.list[i].sys.country} (Lat: ${data.list[i].coord.lat}, Lon: ${data.list[i].coord.lon})</p>
                            <p id="temp5">Temperatura: ${data.list[i].main.temp.toFixed(0)} ºC</p>
                            <p id="description5">Previsão: ${data.list[i].weather[0].description}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.querySelector(".searchList").insertAdjacentHTML('beforeend', searchResult);
    }
}

function clearSearchResults(className) {
    let elem = document.getElementsByClassName(className);

    while(elem[0]) {
        elem[0].parentNode.removeChild(elem[0]);
    }
}