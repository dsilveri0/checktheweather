let verifierForCities = 0;
let resultsCont = 0;

function ipLookUp () {
    $.ajax({
        url: 'https://ipinfo.io',
        dataType: 'jsonp',       
        jsonp: 'callback',
    })
    .then(
        function success(response) {
            console.log(response);
        },

        function fail(data, status) {
            console.log('Request failed.  Returned status of', 
            status);
        }
    );
}
ipLookUp()

window.onload = () => {

    getWeatherByID(2267095);
    //getWeatherByCoord();

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

function getWeatherByCoord(coord) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?${coord}&units=metric&appid=5cccb144e99fcd50583cc21521086247&lang=pt`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);

                fillFieldDetails(json);

            } else {
                console.log('error msg: ' + req.status);
            }
        }
    }
    req.send();
}


function getWeatherByID(id) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&appid=5cccb144e99fcd50583cc21521086247&lang=pt`;
    let req = new XMLHttpRequest();

    req.open('GET', API_URL);
    req.onload = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let json = JSON.parse(req.responseText);

                fillFieldDetails(json);

            } else {
                console.log('error msg: ' + req.status);
            }
        }
    }
    req.send();
}

function getTime(unix_time) {

    let time = new Date(unix_time*1000);

    let hour = addZero(time.getHours());
    let minute = addZero(time.getMinutes());
    let weekarray = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]
    let weekday = weekarray[time.getUTCDay()];

    return `${weekday}, ${hour}:${minute}`;
}

function addZero(i) {
    if (i < 10) {
      i = `0${i}`;
    }
    return i;
}

function fillFieldDetails(data) {
    let icon = data.weather[0].icon;
    let time = getTime(data.dt);

    let detailsCard = `
        <div class="col-xs col-sm col-md" style="margin-bottom: 20px;">           
            <div class="citycard">
                <table class="table table-borderless">
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
                                <img class="iconWeather" src="https://openweathermap.org/img/wn/${icon}@2x.png">
                                <div class="maxTemp">
                                    <p class="max" center>${data.main.temp_max}º</p>
                                </div>
                                <div class="minTemp">
                                    <p class="min center">${data.main.temp_min}º</p>
                                </div>
                            </th>
                            <td class="tdFirstCol">
                                <div class="firstCol">
                                    <h2 style="margin:0">${data.name}, ${data.sys.country}</h2>
                                    <p><small>(Latitude: ${data.coord.lon}, Longitude: ${data.coord.lat})</small></p>
                                    <p>${time} UTC-${data.timezone}</p>
                                    <p>${data.weather[0].main}, ${data.weather[0].description}</p>
                                </div>
                            </td>
                            <td class="tdSecondCol">
                                <div class="secondCol">
                                    <p>Temperatura: ${data.main.temp} ºC</p>
                                    <p>Temperatura sentida: ${data.main.feels_like} ºC</p>
                                    <p>Pressão: ${data.main.pressure} hPa</p>
                                    <p>Humidade: ${data.main.humidity} %</p>                    
                                </div>
                            </td>
                            <td class="tdThirdCol">
                                <div class="thirdCol">
                                    <p>Visibilidade: ${data.visibility}m</p>
                                    <p>Nuvens: ${data.clouds.all} %</p>           
                                    <p>Velocidade do vento: ${data.wind.speed} m/s</p>
                                    <div class="windDIV">
                                        Direção do Vento: ${direction(data.wind.deg)}
                                        <i id="rotatedArrow" class="fas fa-long-arrow-alt-up fa-1x"></i>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"></th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row"></th>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    document.querySelector(".testingDiv").innerHTML = detailsCard;
    
    rotate(data.wind.deg);
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