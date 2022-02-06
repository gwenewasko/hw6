// Variables
const searchCities = JSON.parse(localStorage.getItem("cityHistory")) || [];

// Functions
// API fetch
function handleCoords(searchCity) {
  const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      handleCurrentWeather(data.coord, data.name);
    });
}

// Fetches current weather
function handleCurrentWeather(coordinates, city) {
  const lat = coordinates.lat;
  const lon = coordinates.lon;

  const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayCurrentWeather(data.current, city);
      displayFiveDayWeather(data.daily);
    });
}

// Shows searched city current weather conditions
function displayCurrentWeather(currentCityData, cityName) {
  let weatherIcon = `https://openweathermap.org/img/wn/${currentCityData.weather[0].icon}.png`;
  let uvColor = uvColorChange(currentCityData.uvi);
  document.querySelector(
    "#currentWeather"
  ).innerHTML = `<h2 class="f-400"><span class="f-bold">${cityName}</span> ${moment
    .unix(currentCityData.dt)
    .format(
      "MMM Do, YYYY"
    )} <img src="${weatherIcon}"><div class="b"></h2> <div class="f-sm f-bold">Temp: ${
    currentCityData.temp
  } \xB0F</div> <div class="f-sm f-bold">Wind: ${
    currentCityData.wind_gust
  } MPH</div> <div class="f-sm f-bold">Humidity: ${
    currentCityData.humidity
  } %</div> <div class="f-sm f-bold mb-5">UV Index: <span class="rounded p-1 ${uvColor}"> ${
    currentCityData.uvi
  } </span> </div></div>`;
}

// Display UV index color for safe, moderate and high
function uvColorChange(uvIndex) {
  if (uvIndex < 3) {
    return "bgc-green";
  } else if (uvIndex >= 3 && uvIndex < 6) {
    return "bgc-yellow";
  } else {
    return "bgc-red";
  }
}

// Shows city 5-day forecast
function displayFiveDayWeather(fiveDayCityData) {
  const cityData = fiveDayCityData.slice(1, 6);
  document.querySelector("#fiveDayWeather").innerHTML = "";

  cityData.forEach((day) => {
    let weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    document.querySelector(
      "#fiveDayWeather"
    ).innerHTML += `<div class="card bgc-blue col-sm m-2"> <div class="pt-3"><img src="${weatherIcon}"></div> <div class="t-c-blue f-bold mb-3">${moment
      .unix(day.dt)
      .format(
        "dddd"
      )}</div><div class="t-c-blue"><span class="f-italic">Temp:</span> ${
      day.temp.day
    }\xB0</div><div class="t-c-blue"><span class="f-italic">Wind:</span> ${
      day.wind_gust
    } MPH</div><div class="t-c-blue pb-3"><span class="f-italic">Humidity:</span> ${
      day.humidity
    }%</div></div>`;
  });
}

// Search button submit
function handleFormSubmit(event) {
  document.querySelector("#searchHistory").innerHTML = "";
  event.preventDefault();
  const city = document.querySelector("#searchInput").value.trim();
  searchCities.push(city.toLowerCase());
  const filteredCities = searchCities.filter((city, index) => {
    return searchCities.indexOf(city) === index;
  });
  localStorage.setItem("cityHistory", JSON.stringify(filteredCities));
  showSearchButtons(filteredCities);
  handleCoords(city);
}

// On page load, shows any past cities searched
function showSearchButtons(cities) {
  cities.forEach((city) => {
    document.querySelector(
      "#searchHistory"
    ).innerHTML += `<button class="btn btn-outline-secondary f-400 tt-c mt-2 w-100" data-city="${city}">${city}</button>`;
  });
}

function handleHistory(event) {
  const city = event.target.getAttribute("data-city");
  handleCoords(city);
}

showSearchButtons(searchCities);

// Click on city to show weather
document
  .querySelector("#searchForm")
  .addEventListener("submit", handleFormSubmit);
document
  .querySelector("#searchHistory")
  .addEventListener("click", handleHistory);
