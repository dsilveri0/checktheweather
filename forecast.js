let verifierForCities = 0;
let resultsCont = 0;

window.onload = () => {

    loadForecast();

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
}

function loadForecast() {
    let newID = sessionStorage.getItem("cityIdForecast");
    console.log(newID)

    if(newID == null || typeof newID == "undefined") {

        getLocation();

    } else if(newID != null || typeof newID != "undefined"){
        getWeatherByID(newID);        
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            getWeatherByCoord(`lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
        }, (error) => {
            if(error.code == error.PERMISSION_DENIED) {
                getUserData();
            }
        });
    } else {
        console.log("error");
    }
}

function getUserData() {
    const API_URL = `https://ipinfo.io/geo?token=efeb15b33f1e2b`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);

                getCity(json.region, json.country);

            } else {
                console.log('error msg: ' + req.status);
            }
        }
    }
    req.send();
}

function getCity(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=5cccb144e99fcd50583cc21521086247&cnt=5&lang=pt`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);

                getWeatherByID(json.id);

            } else {
                console.log('error msg: ' + req.status);
            }
        }
    }
    req.send();
}


function getWeatherByCoord(coord) {
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast?${coord}&units=metric&appid=5cccb144e99fcd50583cc21521086247&lang=pt`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);

                fillFieldDetails(json);

                let data = [];
                for(let index = 0; index < json.cnt; index++) {
                    let time = getCustomTime(json.list[index].dt);
                    data.push(
                        { "x": time, "y": json.list[index].main.temp }
                    );
                    console.log("time: " + data[index].x + " index: " + index);
                    console.log("temp: " + data[index].y);
                }
                createSVG(data);

            } else {
                console.log('error msg: ' + req.status);
            }
        }
    }
    req.send();
}

function getWeatherByID(id) {
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast?id=${id}&units=metric&appid=5cccb144e99fcd50583cc21521086247&lang=pt`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);

                fillFieldDetails(json);
                
                let data = [];
                for(let index = 0; index < json.cnt; index++) {
                    let time = getCustomTime(json.list[index].dt);
                    data.push(
                        { "x": time, "y": json.list[index].main.temp }
                    );
                    console.log("time: " + data[index].x + " index: " + index);
                    console.log("temp: " + data[index].y);
                }
                createSVG(data);

                sessionStorage.setItem("cityIdForecast", json.city.id);

            } else {
                console.log('error msg: ' + req.status);
            }
        }
    }
    req.send();
}

function createSVG(data) {
    let margin = {top: 100, right: 15, bottom: 160, left: 30};   
        width = 600 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    let x = d3.scaleTime()
        .domain([d3.max(data, function(d) { return data[0].x; }), d3.max(data, function(d) { return data[7].x; })])
        .range([0, width])
        .nice()
    
    let y = d3.scaleLinear()
        .domain([d3.max(data, function(d) { return data[0].y-15; }), d3.max(data, function(d) { return data[0].y+15; })])
        .range([height, 0])
        .nice();
    
    let xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(d3.timeFormat("%H:%M"))

    let area = d3.area()
        .x(function(d) { return x(d.x); })
        .y0(height)
        .y1(function(d) { return y(d.y); });

    let line = d3.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); })

    let svg = d3.select("#placer").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "graphArea")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    svg.append("g").selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("cx", function(d) {
            return x(d.x)
        })
        .attr("cy", function(d) {
            return y(d.y)
        })
        .attr("fill", "#ff733b")
        .attr("stroke", "#ff733b")

    svg.append("g").selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(d) {
            return x(d.x) - 15
        })
        .attr("y", function(d) {
            return y(d.y) - 20
        })
        .attr("fill", "black")
        .attr("font-size", "12px")
        .attr("class", "degreesClass")
        .text(function(d) {
            return Math.round(d.y) + "ºC"
        });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        d3.select("svg").append("rect")
        .attr("x", 50)
        .attr("y", 10)
        .attr("width", 110)
        .attr("height", 30)
        .attr("fill", "#eeeeee")
        .attr("class", "temperatureButton")

    d3.select("svg").append("g").append("text")
        .attr("x", 60)
        .attr("y", 30)
        .attr("fill", "black")
        .attr("font-size", "15px")
        .text("Temperatura");

    let weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    for(let i = 0; i<weekdays.length; i++) {
        d3.select("svg").append("rect")
            .attr("x", 45+(110*i))
            .attr("y", 230)
            .attr("width", 90)
            .attr("height", 110)
            .attr("fill", "white")
            .attr("stroke", "#ff8a58")
            .attr("class", weekdays[i])
        
        d3.select("svg").append("g").append("text")
            .attr("x", 75+(110*i))
            .attr("y", 250)
            .attr("fill", "black")
            .attr("font-size", "15px")
            .text(`${weekdays[i]}`);
        
        d3.select(`.${weekdays[i]}`)
        .on("click", () => {
            d3.event.preventDefault()
            console.log(`this is ${weekdays[i]}`);
            console.log(data[0].x)
            updateSVG(data)
        })
    }
}

function updateSVG(data) {
    d3.select("svg")
        .selectAll("path")
        .remove();

    d3.select("svg")
        .selectAll("circle")
        .remove();

    d3.select("svg")
        .selectAll(".degreesClass")
        .remove();

    d3.select("svg")
        .selectAll(".axis")
        .remove();

    let margin = {top: 100, right: 15, bottom: 160, left: 30};   
        width = 600 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    let x = d3.scaleTime()
        .domain([d3.max(data, function(d) { return data[3].x; }), d3.max(data, function(d) { return data[9].x; })])
        .range([0, width])
        .nice()

    let y = d3.scaleLinear()
        .domain([d3.max(data, function(d) { return data[1].y-15; }), d3.max(data, function(d) { return data[1].y+15; })])
        .range([height, 0])
        .nice();

    let xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(d3.timeFormat("%H:%M"))

    let area = d3.area()
        .x(function(d) { return x(d.x); })
        .y0(height)
        .y1(function(d) { return y(d.y); });

    let line = d3.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); })

    let svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "graphArea")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    svg.append("g").selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("cx", function(d) {
            return x(d.x)
        })
        .attr("cy", function(d) {
            return y(d.y)
        })
        .attr("fill", "#ff733b")
        .attr("stroke", "#ff733b")

    svg.append("g").selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(d) {
            return x(d.x) - 15
        })
        .attr("y", function(d) {
            return y(d.y) - 20
        })
        .attr("fill", "black")
        .attr("font-size", "12px")
        .text(function(d) {
            return Math.round(d.y) + "ºC"
        });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
}

function getTimeWithWeek(unix_time) {

    let time = new Date(unix_time*1000);

    let hour = addZero(time.getHours());
    let minute = addZero(time.getMinutes());
    let weekarray = [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado"
    ]
    let weekday = weekarray[time.getUTCDay()];

    return `${weekday}, ${hour}:${minute}`;
}

function getTime(unix_time) {

    let time = new Date(unix_time*1000);

    let hour = addZero(time.getHours());
    let minute = addZero(time.getMinutes());

    return `${hour}:${minute}`;
}

function getCustomTime(unix_time) {

    let time = new Date(unix_time*1000);
    let custom = time.getTime();

    return custom;
}

function addZero(i) {
    if (i < 10) {
      i = `0${i}`;
    }
    return i;
}

function fillFieldDetails(data) {
    let icon = data.list[0].weather[0].icon;
    let time = getTimeWithWeek(data.list[0].dt);
    let sunrise = getTime(data.city.sunrise);
    let sunset = getTime(data.city.sunset);

    let detailsCard = `
        <div class="col-xs col-sm col-md" style="margin-bottom: 20px;">           
            <div class="citycard">
                <table class="table table-borderless table-responsive-lg">
                    <thead>
                        <tr>
                            <th scope="col" colspan="2">Detalhes:</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th class="text-center" scope="row">
                                <div class="text-center iconMaxMin">
                                    <img class="iconWeather" src="https://openweathermap.org/img/wn/${icon}@2x.png">
                                    <div class="maxTemp">
                                        <p class="max" center>${data.list[0].main.temp_max}º</p>
                                    </div>
                                    <div class="minTemp">
                                        <p class="min center">${data.list[0].main.temp_min}º</p>
                                    </div>
                                </div>
                            </th>
                            <td class="row tdFirstCol">
                                <div class="nameCoords col-xs-6 col-sm-6 col-md">
                                    <h2 style="">${data.city.name}, ${data.city.country}</h2>
                                    <p><small>(Latitude: ${data.city.coord.lon}, Longitude: ${data.city.coord.lat})</small></p>
                                </div>
                                <div class="utcDescri col-xs-6 col-sm-6 col-md">
                                    <h5>${time} UTC ${data.city.timezone}</h5>
                                    <p>${data.list[0].weather[0].main}, ${data.list[0].weather[0].description}</p>
                                </div>
                            </td>
                            <td class="row">
                                <div class="nameCoords col-xs-6 col-sm-6 col-md">
                                    <div id="placer"></div>
                                </div>
                            </td>
                            <td class="row tdSecondCol">
                                <div class="col-xs-6 col-sm-4 col-md-3 firstCol">
                                    <div>
                                        <i class="wi wi-thermometer iTemperature"></i>
                                        <p class="pTemperature">${data.list[0].main.temp} ºC</p>
                                    </div>
                                    <div>
                                        <i class="wi wi-thermometer iTemperature"></i>
                                        <p class="pTemperature">${data.list[0].main.feels_like} ºC</p>
                                    </div>
                                </div>
                                <div class="col-xs-6 col-sm-4 col-md-3 secondCol">
                                    <div>
                                        <i class="wi wi-barometer iPressure"></i>
                                        <p class="pPressure">${data.list[0].main.pressure} hPa</p>
                                    </div>
                                    <div>
                                        <i class="wi wi-humidity iHumidity"></i>
                                        <p class="pHumidity">${data.list[0].main.humidity} %</p>                    
                                    </div>
                                </div>
                                <div class="col-xs-6 col-sm-4 col-md-3 thirdCol">
                                    <div>
                                        <i class="wi wi-cloudy iCloudy"></i>     
                                        <p class="pCloudy">${data.list[0].clouds.all} %</p>   
                                    </div>
                                </div>
                                <div class="col-xs-6 col-sm-4 col-md-3 forthCol">
                                    <div>
                                        <i class="wi wi-strong-wind iWindy"></i>
                                        <p class="pWindy">${data.list[0].wind.speed} m/s</p>
                                        <div class="windDIV">
                                            Direção: ${direction(data.list[0].wind.deg)}
                                            <i id="rotatedArrow" class="fas fa-long-arrow-alt-up fa-1x"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-6 col-sm-4 col-md-3 forthCol">
                                    <div>
                                        <i class="wi wi-sunrise iSunrise"></i>
                                        <p class="pSunrise">${sunrise}</p>
                                    </div>
                                    <div>
                                        <i class="wi wi-sunset iSunset"></i>
                                        <p class="pSunset">${sunset}</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    document.querySelector(".testingDiv").innerHTML = detailsCard;
    rotate(data.list[0].wind.deg);
}

function direction(degress) {
    if (degress === 0) {
        return "S";
    }else if (degress > 0 && degress < 90) {
        return "SW";
    }
    else if (degress === 90) {
        return "W";
    }
    else if (degress > 90 && degress < 180) {
        return "NW";
    }
    else if (degress === 180) {
        return "N";
    }
    else if (degress > 180 && degress < 270) {
        return "NE";
    }
    else if (degress === 270) {
        return "E";
    }
    else if (degress > 270 && degress < 360) {
        return "SE";
    }
}

function rotate(degrees) {
    document.getElementById("rotatedArrow").setAttribute("style", `-webkit-transform:rotate(${degrees}deg)`);
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
    resultsCont = 0;
    spawnSearchResults()

    let contentVerifier = document.querySelector(".searchList").innerHTML;

    if (data.count != 0) {
        if(contentVerifier == "") {
            
            callFillAndAddListener(data);
        
        } else if(contentVerifier != ""){
            callFillAndAddListener(data);
        }
    } else if (data.count === 0) {
        if (verifierForCities === 0) {
            document.querySelector(".searchList").innerHTML = `<p id="notFound" class="groupData alert alert-danger" style="text-align: center; margin: 25px;">Cidade não encontrada!</p>`;
        }
    }
}

function callFillAndAddListener(data) {
    clearSearchResults('groupData');
    fillFieldsSearchResults(data);

    let resultsLength = document.getElementsByClassName("searchBtn");

    for(let i = 0; i < resultsLength.length; i++) {
        let eventButtonsSel = document.querySelector(`.searchBtn${i}`);
        
        eventButtonsSel.addEventListener("click", () => {
            let values = document.getElementById(`searchResultsID${i}`).value;
            let id = values.split(", ").slice(2,3)

            getWeatherByID(id);

        });
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
                            <p id="cityCountry${resultsCont}">${data.list[i].name}, ${data.list[i].sys.country} (Lat: ${data.list[i].coord.lat}, Lon: ${data.list[i].coord.lon})</p>
                            <p id="temper${resultsCont}">Temperatura: ${data.list[i].main.temp.toFixed(0)} ºC</p>
                            <p id="description${resultsCont}">Previsão: ${data.list[i].weather[0].description}</p>
                        </div>
                    </div>
                    <div class"col-xs-2 col-sm-3 col-md-2 col-lg-2 groupData" style="margin:${marginStar} auto;">
                        <i class="fas fa-search fa-2x center groupData buttonsResults searchBtn searchBtn${resultsCont}"></i>
                        <input type="hidden" id="searchResultsID${resultsCont}" value="${data.list[i].name}, ${data.list[i].sys.country}, ${data.list[i].id}">
                    </div>
                </div>
            </div>
        `;
        resultsCont = resultsCont + 1;
        document.querySelector(".searchList").insertAdjacentHTML('beforeend', searchResult);
    }
}

function clearSearchResults(className) {
    let elem = document.getElementsByClassName(className);

    while(elem[0]) {
        elem[0].parentNode.removeChild(elem[0]);
    }
}

