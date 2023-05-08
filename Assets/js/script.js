var APIKey = "5f44ff874e61bfc54c26d3b52b2458eb"; 
var currentWeather = $('#currentForecast');
var weekForecast = $('#five-day-forecast');
var userInputEle = $('.form-input');
var historyEle = $('#search-history');
var searchBtn = $('#search-button');
var locationDisEle = $('#forecast-display');
var searchHistory = [];
var userInput;

searchBtn.on("click", function(event) {
  getSearchHistory();
  event.preventDefault();
  userInput = userInputEle.val();
  console.log('userInput==>'+userInput);
  weatherInfo(userInput);
  saveSearch(userInput);
  getSearchHistory();
});
window.addEventListener('DOMContentLoaded', (event) => {
    getSearchHistory();
  });

function getSearchHistory (input) {
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  historyEle.html('');
  if (searchHistory !== null) {
    var historyValue
    var val;
    for (var i = 0; i < searchHistory.length; i++) {
      val = searchHistory[i];
      historyValue = $('<p>').text(val);
      historyValue.on("click",function(event) {  
        event.preventDefault();
        weatherInfo(val);
      });
      historyEle.append(historyValue);
    }
  } else {
    var searchHistory = [];
    return;
  }
}

function saveSearch(input) {
  searchHistory.push(input);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function fetchData (data, index) {
  var date = data.daily[index].dt;
  var tempHi = data.daily[index].temp.max;         
  var tempLo = data.daily[index].temp.min;        
  var humidity = data.daily[index].humidity;         
  var wind = data.daily[index].wind_speed;         
  var weatherImg = data.daily[index].weather[0].icon;         
  var humidity = data.daily[index].humidity;        
  var windSpeed = data.current.wind_speed;        
  return {date,tempHi,tempLo,humidity,wind,weatherImg, humidity,windSpeed};
}

function weatherInfo(input) {
  currentWeather.html('');
  weekForecast.html('');
  locationDisEle.html('');
  locationDisEle.text(input);
  let URL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + APIKey;
    fetch(URL)
    .then(response => response.json())
    .then(function (data) {
      console.log('data ==>'+data);
      var URL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lat + "&appid=" + APIKey + "&units=imperial";
      fetch(URL)
          .then(response => response.json())
          .then(function (data) {
          console.log('data==>'+data);
          var weatherObj = fetchData(data,0);
          let {date,tempHi,tempLo,humidity,wind,weatherImg,windSpeed} = weatherObj;
          render (date, 'date', currentWeather, "");
          render (weatherImg, 'img', currentWeather, "");
          render (tempHi, 'stats', currentWeather, "Temperature High");
          render (tempLo, 'stats', currentWeather, "Temperature Low");
          render (humidity, 'stats', currentWeather, "Humidity");
          render (windSpeed, 'stats', currentWeather, "Wind Speed");
          for (var i = 1; i < 6; i++) {
            var weekForecastDayOfCard = $('<div class = "forecast">');
            var weatherObj = fetchData(data,i);
            let {date,tempHi,tempLo,humidity,weatherImg} = weatherObj;
            render (date, 'date', weekForecastDayOfCard);
            render (weatherImg, 'img', weekForecastDayOfCard);
            render (tempHi, 'stats', weekForecastDayOfCard, "Temperature High");
            render (tempLo, 'stats', weekForecastDayOfCard, "Temperature Low");
            render (humidity, 'stats', weekForecastDayOfCard, "Humidity");
            weekForecast.append(weekForecastDayOfCard);
          }        
        });
    });
}
function render(data, dataType, target, text) {
    switch(dataType) {
      case 'img' :
        var weatherImgEle = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + data + "@2x.png");
        target.append(weatherImgEle);
        break;
        case 'date':
        var dateText = moment.unix(data).format('dddd MMM Do YYYY');
        console.log("date==>"+dateText);
        var forecastDiv = $('<div>');
        forecastDiv.append($('<h1>').text(dateText));
        target.append(forecastDiv);
      break;
      case 'stats':
        ele = $('<h3>').text(`${text}: `+ data); 
        target.append(ele);
      case 'history':
      break; 
    }
  }