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
    const API_URL = `https://api.openweathermap.org/data/2.5/find?q=${city}&units=metric&appid=5cccb144e99fcd50583cc21521086247&cnt=5&lang=pt`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);
                                              
                console.log(json.list[0].weather[0].description);
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

// Call this function inside the findCity fucntion.
function displaySearchResults(data) {
    // This function must display the search results on the page.
    for(let i = 0; i<data.list.length; i++) {
        console.log(data.list[i].name);
        console.log(data.list[i].sys.country);
        console.log("lat: " + data.list[i].coord.lat);
        console.log("lon: " + data.list[i].coord.lon);
        console.log("temp" + data.list[i].main.temp);
        console.log(data.list[i].weather[0].description);

        document.getElementById("cityCountry5").textContent = `${data.list[i].name}, ${data.list[i].sys.country}`;
        document.getElementById("coords5").textContent = `Lat: ${data.list[i].coord.lat}, Lon: ${data.list[i].coord.lon}`;
        document.getElementById("temp5").textContent = `Temp: ${data.list[i].main.temp.toFixed(0)} ºC`;
        document.getElementById("description5").textContent = data.list[i].weather[0].description;

    }
}