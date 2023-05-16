//Instance variables
const locationElement = document.querySelector('[data-location]')
const statusElement = document.querySelector('[data-status]')
const temperatureElement = document.querySelector('[data-temperature]')
const forecastElement = document.querySelector('[data-forecast]')
const humidityElement = document.querySelector('[data-humidity]')
const preciElement = document.querySelector('[data-preci]')
var weatherInfo = document.getElementById("weatherInfo");
var timeText = document.getElementById("time");
var inconHtml = document.getElementById("icon");
var report = document.getElementById("report");
var location1 = document.getElementById("location");
var temp = document.getElementById("temperature");
var title = document.getElementById("title");
var body = document.getElementsByTagName("body");
var searchBox = document.getElementById("searchBox");
var buttonTitle = document.getElementById("buttonTitle");
var speciForecast = document.getElementById("speciForecast");
var speciText = document.getElementsByClassName("speciText");
var speciTitle = document.getElementsByClassName("speciTitle");
const desktopPics = ['hillyDay1.jpg', 'hillyDay2.jpg', 'hillyDay3.jpg', 'lifeSunny1.jpg', 'lifeSunny2.jpg', 'sunnyHilly5.jpg'];
const imgUrl = ['cloudyMoon.png', 'cloud.png', 'thunderstormIcon.png', 'snowIcon.png', 'nightFog.png', 'dayFog.png', 'dayDrizzle.png', 'nightDrizzle.png', 'dayRain.png', 'nightRain.png', 'dayClear.png', 'nightClear.png', 'dayClouds.png'];
const cityButton = document.querySelector(".cityButton")
const bodycolor = document.querySelector(".bodyStyle")
var inputValue = document.querySelector(".searchInput");
var slideIndex = 0;
var a=0; 
var b=3;
var c=5;
var d=7;
var e=10;
var f=13;
var g=18;
var h=19;
var j=21;
var APIKEY = process.env.API_TOKEN

//Converts Temperature from Kelvin to Farneheit
function kTof(kelvin){
  var faren = ((kelvin-273.15)*1.8)+32;
  return faren;
}

//API Request to OpenWeatherAPI
function search() {
        fetch('https://api.openweathermap.org/data/2.5/weather?q='+ inputValue.value + '&appid=' + APIKEY)
.then(res => res.json())
.then(data => {
    //make buttonTitle display none
    //searchBox marginTOp  to -180px
    buttonTitle.style.display = "none";
    searchBox.style.marginTop = "-180px";
    speciForecast.style.display = "inline-flex";
    for(var ind=0;ind<7;ind++)
    {
        speciTitle[ind].style.display = "none";
    }
    var feelLike = kTof(data["main"]["feels_like"]);
    feelLike = String(feelLike);
    console.log(feelLike);
    feelLike = feelLike.substr(0,5);
    speciText[0].innerText = feelLike  + "°";
    speciText[1].innerText = data["main"]["humidity"] + "%";
    speciText[2].innerText = data["main"]["pressure"] + " hPa";
    let unix_timestamp = data["sys"]["sunset"]; 
    console.log(unix_timestamp);
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    var sunsetTime = hours + ':' + minutes.substr(-2) + " PM";
    let unix_timestamp2 = data["sys"]["sunrise"]; 
    var date2 = new Date(unix_timestamp2 * 1000);
    var hours2 = date2.getHours();
    var minutes2 = "0" + date2.getMinutes();
    var seconds2 = "0" + date2.getSeconds();
    var sunriseTime = hours2 + ':' + minutes2.substr(-2) + " AM";
    var fixSunTime2 = 0;
    var fixSunTime = parseInt(sunsetTime.substr(0,2)) - 12;
    console.log(sunsetTime + " " + date2);
    sunsetTime = fixSunTime + sunsetTime.substr(2, sunsetTime.length);
    speciText[4].innerText = sunsetTime;
    speciText[5].innerText = data["visibility"] + " m";
    speciText[6].innerText = data["wind"]["speed"] + " m/s";
    console.log(inputValue.value);
    let tempValue = data["main"]["temp"];
    let tempValueConvert = Math.round((tempValue - 273.15) * 9/5 + 32) + "° F"; 
    var currentHour = 0;
    setInterval(()=>{
        var today= new Date();
        var dateTime = today.toLocaleString();
        var time = today.toLocaleTimeString();
        title.innerText = dateTime;
        currentHour = parseInt(dateTime.substr(10,11));
        console.log("Current Hour is " + currentHour);
    },1000);
    var today= new Date();
    var shortTime = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    console.log("The location is" + data["name"]);
    location1.innerText = data["name"] + ", " + data["sys"]["country"];
    var isDay = true;
    
    //API Requaest to IPGeolocationAPI
    fetch('https://api.ipgeolocation.io/timezone?apiKey=7cf838a077034a07a7f031f906157fce&location=' + inputValue.value +  ',%20' + data["sys"]["country"])
    .then(res => res.json())
    .then(data => {
        var localTime = data["time_12"];
        var fixNum = parseInt(localTime.substr(0,2)) + 1;
        console.log("fixNum is " + fixNum);
        if(localTime.substr(0,1)=="0")
        {
            localTime = "0" + localTime.substr(1,localTime.length); 
        }
        localTime = fixNum + localTime.substr(2, localTime.length);
        if(localTime.substr(0,1)=="0")
        {
            time.innerText = localTime.substr(1,localTime.length); 
        }
        if(localTime.substr(1,1) == ":")
        {
            localTime = localTime.substr(0,4) + " " + localTime.substr(8,11);
            time.innerText = localTime;
            fixSunTime2 += Math.abs((parseInt(localTime.substr(0,1))) - currentHour);
        }
        else
        {
            localTime = localTime.substr(0,5) + " " + localTime.substr(9,11);
            time.innerText = localTime;
            fixSunTime2 += Math.abs(parseInt(localTime.substr(0,1)) - currentHour);
        }
        if(parseInt(localTime.substr(0,2)) < 7 && localTime.substr(6,8) == "AM")
        {
            isDay = false;
        }
        else if(parseInt(localTime.substr(0,2)) > 8 && localTime.substr(6,8) == "PM")
        {
            isDay = false;
        }
        console.log(localTime.substr(0,2) + " " + localTime.substr(6,8) + " " + isDay);
        console.log("First " + sunriseTime.substr(0,2));
        sunriseTime = fixSunTime2 + sunriseTime.substr(2, sunriseTime.length);
        speciText[3].innerText = sunriseTime;
    })
    temp.innerText = tempValueConvert;
    report.innerText = data["weather"][0]["description"];
    hour = shortTime
    var main = data["weather"][0]["main"];
    var imgIndex = 0;
    const dekstopBG = ['cloudyDay2.jpg', 'cloudDay3.jpg', 'cloudDay4.jpg', 'nightCloudy1.jpg', 'nightCloudy3.jpg', 'sunnyDay3.jpg', 'sunnyDay4.jpg', 'lifeNight2.jpg', 'lifeNight1.jpg', 'cityNight1.jpg', 'fog1.jpg', 'fog2.jpg', 'fog3.jpg', 'snow1.jpg', 'snow2.jpg', 'snow3.jpg', 'snow4.jpg', 'snow5.jpg', 'drizzle1.jpg', 'drizzle2.jpg', 'rain1.jpg', 'rain2.jpg', 'storm1.jpg', 'storm2.jpg', 'storm3.jpg']
    if(main == "Thunderstorm")
    {
        imgIndex = 2;
        document.body.style.animation = "fadeIn 2s";
        document.body.style.backgroundImage = 'url(' + '"' + dekstopBG[j] + '"' + ')';
        j++;
        if (j>23)
        {
            j=21;
        }
        setTimeout(() =>{
            document.body.style.animation = "l";
        }, 2100);
    }
    else if(main == "Drizzle" && !isDay)
    {
        imgIndex = 7;
        document.body.style.animation = "fadeIn 2s";
        document.body.style.backgroundImage = 'url(' + '"' + dekstopBG[h] + '"' + ')';
        h++;
        if (h>21)
        {
            h=19;
        }
        setTimeout(() =>{
            document.body.style.animation = "l";
        }, 2100);
    }
    else if(main == "Drizzle" && isDay)
    {
        imgIndex = 6;
        document.body.style.animation = "fadeIn 2s";
        document.body.style.backgroundImage = 'url(' + '"' + dekstopBG[h] + '"' + ')';
        h++;
        if (h>21)
        {
            h=19;
        }
        setTimeout(() =>{
            document.body.style.animation = "l";
        }, 2100);
    }
    else if(main == "Rain" && !isDay)
    {
        imgIndex = 9;
        document.body.style.animation = "fadeIn 2s";
        document.body.style.backgroundImage = 'url(' + '"' + dekstopBG[g] + '"' + ')';
        g++;
        if (g>19)
        {
            g=18;
        }
        setTimeout(() =>{
            document.body.style.animation = "l";
        }, 2100);
    }
    else if(main == "Rain" && isDay)
    {
        imgIndex = 8;
        document.body.style.animation = "fadeIn 2s";
        document.body.style.backgroundImage = 'url(' + '"' + dekstopBG[g] + '"' + ')';
        g++;
        if (g>19)
        {
            g=18;
        }
        setTimeout(() =>{
            document.body.style.animation = "l";
        }, 2100);
    }
    else if(main == "Snow")
    {
        imgIndex = 3;
        document.body.style.animation = "fadeIn 2s";
        document.body.style.backgroundImage = 'url(' + '"' + dekstopBG[f] + '"' + ')';
        f++;
        if (f>17)
        {
            f=13;
        }
        setTimeout(() =>{
            document.body.style.animation = "l";
        }, 2100);
    }
    else if((main == "Mist" || main == "Smoke" || main == "Haze" || main == "Dust" || main == "Fog" || main == "Sand" || main == "Ash" || main == "Squall" || main == "Tornado") && isDay)
    {
        imgIndex = 5;
        document.body.style.animation = "fadeIn 2s";
        document.body.style.backgroundImage = 'url(' + '"' + dekstopBG[e] + '"' + ')';
        e++;
        if (e>12)
        {
            e=10;
        }
        setTimeout(() =>{
            document.body.style.animation = "l";
        }, 2100);
    }
    else if((main == "Mist" || main == "Smoke" || main == "Haze" || main == "Dust" || main == "Fog" || main == "Sand" || main == "Ash" || main == "Squall" || main == "Tornado") && !isDay)
    {
        imgIndex = 4;
        document.body.style.animation = "fadeIn 2s";
        document.body.style.backgroundImage = 'url(' + '"' + dekstopBG[e] + '"' + ')';
        e++;
        if (e>12)
        {
            e=10;
        }
        setTimeout(() =>{
            document.body.style.animation = "l";
        }, 2100);
    }
    else if(main == "Clear" && !isDay)
    {
        imgIndex = 10;
        document.body.style.animation = "fadeIn 2s";
        document.body.style.backgroundImage = 'url(' + '"' + dekstopBG[c] + '"' + ')';
        c++;
        if (c>6)
        {
            c=5;
        }
        if(c == 6)
        {
            weatherInfo.style.backgroundColor = "#00000030";
            weatherInfo.style.borderRadius = "20px";
        }
        setTimeout(() =>{
            document.body.style.animation = "l";
        }, 2100);
    }
    else if(main == "Clear" && isDay)
    {
        imgIndex = 11;
        document.body.style.animation = "fadeIn 2s";
        document.body.style.backgroundImage = 'url(' + '"' + dekstopBG[d] + '"' + ')';
        d++;
        if (d>9)
        {
            d=7;
        }
        setTimeout(() =>{
            document.body.style.animation = "l";
        }, 2100);
    }
    else if(main == "Clouds" && !isDay)
    {
        imgIndex = 1;
        document.body.style.animation = "fadeIn 2s";
        document.body.style.backgroundImage = 'url(' + '"' + dekstopBG[b] + '"' + ')';
        b++;
        if (b>4)
        {
            b=3;
        }
        setTimeout(() =>{
            document.body.style.animation = "l";
        }, 2100);
    }
    else if(main == "Clouds" && isDay)
    {
        document.body.style.animation = "fadeIn 2s";
        imgIndex = 12;
        console.log("tired");
        document.body.style.backgroundImage = 'url(' + '"' + dekstopBG[a] + '"' + ')';
        a++;
        if (a>2)
        {
            a=0;
        }
        setTimeout(() =>{
            document.body.style.animation = "l";
        }, 2100);
    }
    var x = 5;
    inconHtml.innerHTML = "<img id='iconPic' alt='' src='" + imgUrl[imgIndex] + "'>";
    weatherInfo.style.display = "flex";
    })
    .catch(err => console.log(err));
}