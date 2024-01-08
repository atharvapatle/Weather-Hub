// start box

//conatiner box

// const bodyrBox = document.querySelector('.container-lg');
//search bar
const currLocatorBtn = document.getElementById('basic-addon1');
const searchBar = document.getElementById('search-box');
const searchBtn = document.getElementById('search-icon-btn');

// temp and time
const mainWeatherIcon = document.getElementById('weather-img');
const mainTempBox = document.getElementById('temperature');
const mainTempUnitBox = document.getElementById('temp-unit');
const feelsLikeTempBox = document.getElementById('feels-like-temp');
const mainDayBox = document.getElementById('day');
const mainTimeBox = document.getElementById('time');

// weather name and description
const weatherDescIcon = document.getElementById('weather-img-sm');
const weatherNameBox = document.getElementById('weather-name');
const weatherDescBox = document.getElementById('weather-desc');

//location name and state name
const locationBoxes = document.getElementsByClassName('location-name');
const stateNameBoxes = document.getElementsByClassName('state-names');

// end box

// unit selectors
const degCBtn = document.getElementById('degC-unit');
const degFBtn = document.getElementById('degF-unit');

//todays highlights
//pressure
const pressValueBox = document.getElementById('pressure-highlight-value');
const pressDescBox = document.getElementById('pressure-highlight-desc');

//wind
const windSpeedBox = document.getElementById('wind-highlight-value');
const windDescBox = document.getElementById('wind-highlight-desc');

//sunrise and sunset
const sunriseTimeBox = document.getElementById('sunrise-value');
const sunsetTimeBox = document.getElementById('sunset-value');

//humidity
const humidityValueBox = document.getElementById('humidity-highlight-value');
const humidityDescBox = document.getElementById('humidity-highlight-desc');

//visibility
const visibilityValueBox = document.getElementById(
  'visibility-highlight-value'
);
const visibilityDescBox = document.getElementById('visibility-highlight-desc');

//aqi
const aqiValueBox = document.getElementById('aqi-highlight-value');
const aqiDescBox = document.getElementById('aqi-highlight-desc');

//weeks highlights
const weekCardsIcons = document.getElementsByClassName('week-day-img');
const weekCardsDaysBoxes = document.getElementsByClassName('week-day');
const weekCArdsTempBoxes = document.getElementsByClassName('week-day-temp');

//temp-values
const tempValueBoxes = document.getElementsByClassName('temp-values');
const tempUnitBoxes = document.getElementsByClassName('unit-boxes');
