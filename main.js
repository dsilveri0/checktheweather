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
                                              
                fillFieldsNormal(json, value);

            } else {
                console.log('error msg: ' + req.status);
            }
        }
    }
    req.send();
}

function fillFieldsNormal(data, i) {
    let icon = data.weather[0].icon;
    
    document.getElementById("temp"+i).innerHTML = data.main.temp.toFixed(0) + " ºC";
    document.getElementById("icon"+i).setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
    document.getElementById("weather-description"+i).innerHTML = data.weather[0].description;
    document.getElementById("city"+i).innerHTML = data.name;

}

function findCity(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/find?q=${city}&appid=5cccb144e99fcd50583cc21521086247&cnt=5`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);
                                              
                console.log(json);

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

// Call this function inside the findCity fucntion.
function displaySearchResults() {
    // This function must display the search results on the page.
}