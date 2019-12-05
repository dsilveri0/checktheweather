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

function displaySearchResults(data) {
    let contentVerifier = document.querySelector(".searchList").innerHTML;

    if(contentVerifier == "") {
        fillFieldsSearchResults(data);
    } else {
        clearSearchResults();
        fillFieldsSearchResults(data);
    }
}

function fillFieldsSearchResults(data) {
    for(let i = 0; i<data.list.length; i++) {
        let searchResult = `
            <div class="groupData">
                <p id="cityCountry5">${data.list[i].name}, ${data.list[i].sys.country}</p>
                <p id="coords5">Lat: ${data.list[i].coord.lat}, Lon: ${data.list[i].coord.lon}</p>
                <p id="temp5">Temp: ${data.list[i].main.temp.toFixed(0)} ºC</p>
                <p id="description5">${data.list[i].weather[0].description}</p>
                <hr />
            </div>
        `;
        document.querySelector(".searchList").insertAdjacentHTML('beforeend', searchResult);
    }
}

function clearSearchResults() {
    let elem = document.getElementsByClassName('groupData');
    while(elem[0]) {
        elem[0].parentNode.removeChild(elem[0]);
    }
}