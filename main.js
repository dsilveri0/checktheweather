window.onload = () => {
    getWeather("lisboa", "pt", "");
    getWeather("porto", "pt", "2");
}

function getWeather(city, country, value) {
    let req = new XMLHttpRequest();

    req.open('GET', `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=5cccb144e99fcd50583cc21521086247&lang=pt`);
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