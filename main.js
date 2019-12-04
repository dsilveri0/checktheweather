window.onload = () => {
    let xhr = new XMLHttpRequest();
    let zsf = new XMLHttpRequest();
// Request to open weather map -- API --> nova api key - 5cccb144e99fcd50583cc21521086247

    xhr.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=leiria,pt&units=metric&appid=5cccb144e99fcd50583cc21521086247&lang=pt');
    
    xhr.onload = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {

		let json = JSON.parse(xhr.responseText);
		console.log(json);

		let icon = json.weather[0].icon;
		document.getElementById("temp").innerHTML = json.main.temp.toFixed(0) + " ºC";
		document.getElementById("icon").setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
		document.getElementById("weather-description").innerHTML = json.weather[0].description;
		document.getElementById("city").innerHTML = json.name;
            } else {
                console.log('error msg: ' + xhr.status);
            }
        }
    }
    xhr.send();

    zsf.open('api.openweathermap.org/data/2.5/forecast?q=leiria,pt&units=metric&appid=5cccb144e99fcd50583cc21521086247&lang=pt');
    zsf.onload = () => {
        if (zsf.readyState === 4) {
            if (zsf.status === 200) {

		let json = JSON.parse(zsf.responseText);
		console.log(json);

		let icon = json.weather[0].icon;
		document.getElementById("temp2").innerHTML = json.main.temp.toFixed(0) + " ºC";
		document.getElementById("icon2").setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
		document.getElementById("weather-description2").innerHTML = json.weather[0].description;
		document.getElementById("city2").innerHTML = json.name;
            } else {
                console.log('error msg: ' + zsf.status);
            }
        }
    }
    zsf.send();

}


/*
let icon = json.weather[0].icon;
document.getElementById("temp").innerHTML = json.main.temp.toFixed(0) + " ºC";
document.getElementById("icon").setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
document.getElementById("weather-description").innerHTML = json.weather[0].description;
document.getElementById("city").innerHTML = json.name; */
