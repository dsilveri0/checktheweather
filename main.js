window.onload = () => {
    let xhr = new XMLHttpRequest();
    // Request to open weather map -- API --> 5cccb144e99fcd50583cc21521086247
    xhr.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=leiria,pt&units=metric&appid=2b2afaf78c88ac55d3e2127d280f0dbc&lang=pt');
    xhr.onload = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let json = JSON.parse(xhr.responseText);
                let icon = json.weather[0].icon;
                console.log(json);
                document.getElementById("temp").innerHTML = json.main.temp.toFixed(0) + " ºC";
                document.getElementById("icon").setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
                document.getElementById("weather-description").innerHTML = json.weather[0].description;
            } else {
                console.log('error msg: ' + xhr.status);
            }
        }
    }
    xhr.send();
}