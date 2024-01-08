let currentWeatherCity = 'delhi';
let tempUnit = 'degC';

//update UI
function updateUI(error, weatherObj, aqi, weekWeatherList, city, state) {
  if (error) {
    let errorMessage = error.message;
    if (error.message == 'location acess denied') {
      errorMessage +=
        ', allow location permission to fetch your location weather';
    }
    const errorHTML = `<div class="alert alert-danger alert-dismissible fade show my-0" role="alert">
      <div class="container-lg">
         ${errorMessage}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" ></button>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('afterbegin', errorHTML);
    setTimeout(window.scrollTo(0, 0), 100);
    return;
  }

  //updating city name
  for (let box of locationBoxes) {
    box.innerHTML = `${city ? city : ''}`;
  }
  for (let box of stateNameBoxes) {
    box.innerHTML = `${state ? state : ''}`;
  }

  //updating current weather
  let { main, description, icon } = weatherObj.weather[0];

  mainWeatherIcon.setAttribute('src', `assets/${icon}.png`);
  weatherDescIcon.setAttribute('src', `assets/${icon}.png`);
  weatherNameBox.innerHTML = `${main}`;
  weatherDescBox.innerHTML = `${description}`;

  let { temp, pressure, humidity, feels_like } = weatherObj.main;

  temp = Math.round((temp + Number.EPSILON) * 10) / 10;
  mainTempBox.innerHTML = `${temp}`;
  feelsLikeTempBox.innerHTML = `${feels_like}`;

  //updating weather highlights

  //pressure
  let pressureRange;
  if (pressure < 1000) pressureRange = 'low 👎';
  else if (pressure < 1026) pressureRange = 'normal 🤙';
  else pressureRange = 'high 👎';

  pressValueBox.innerHTML = `${pressure}`;
  pressDescBox.innerHTML = `${pressureRange}`;

  //humidity
  let humidityRange;
  if (humidity <= 30) humidityRange = 'low ☀️';
  else if (humidity <= 60) humidityRange = 'moderate 🌤️';
  else if (humidity <= 90) humidityRange = 'high 🌥️';
  else humidityRange = 'very High 🌧️';

  humidityValueBox.innerHTML = `${humidity}`;
  humidityDescBox.innerHTML = `${humidityRange}`;

  //visibility
  const visibilityValue = weatherObj.visibility / 1000;

  let visibilityRange;
  if (visibilityValue <= 1) visibilityRange = 'poor 😟';
  else if (visibilityValue <= 5) visibilityRange = 'moderate 😕';
  else visibilityRange = 'clear 👍';

  visibilityDescBox.innerHTML = `${visibilityRange}`;
  visibilityValueBox.innerHTML = `${visibilityValue}`;

  //wind
  const windSpeed = weatherObj.wind.speed;

  let windRange;
  if (windSpeed < 20) windRange = 'gentle 👍';
  else if (windSpeed < 30) windRange = 'moderate 👍';
  else windRange = 'high 💨';

  windDescBox.innerHTML = `${windRange}`;
  windSpeedBox.innerHTML = `${windSpeed}`;

  //sunrise and sunset
  sunriseTimeBox.innerHTML = `${getDate(weatherObj.sys.sunrise).time}`;
  sunsetTimeBox.innerHTML = `${getDate(weatherObj.sys.sunset).time}`;

  //aqi
  const aqiValue = Number.parseInt(aqi.overall_aqi);

  let aqiCategory;
  if (aqiValue <= 50) aqiCategory = 'good👍';
  else if (aqiValue <= 100) aqiCategory = 'satisfactory 👍';
  else if (aqiValue <= 200) aqiCategory = 'polluted 😐';
  else if (aqiValue <= 300) aqiCategory = 'poor 😮‍💨';
  else if (aqiValue <= 400) aqiCategory = 'very poor 🙁';
  else aqiCategory = 'severe 😔';

  aqiValueBox.innerHTML = `${aqiValue}`;
  aqiDescBox.innerHTML = `${aqiCategory}`;

  //updating week weather
  //days
  Array.from(weekCardsDaysBoxes).forEach((box, idx) => {
    box.innerHTML = `${getDate(weekWeatherList[idx].dt).day.slice(0, 3)}`;
  });
  //temp
  Array.from(weekCArdsTempBoxes).forEach((box, idx) => {
    box.innerHTML = `${weekWeatherList[idx].main.temp}`;
  });
  //icons
  Array.from(weekCardsIcons).forEach((box, idx) => {
    box.setAttribute(
      'src',
      `assets/small/${weekWeatherList[idx].weather[0].icon.slice(0, 2)}.png`
    );
  });

  updateTemp(tempUnit, 'degC');
}

// fetching messages
function addFetchingMsg() {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="fetching-msgs alert alert-secondary fade show my-0" role="alert"><div class="container-lg"><strong>Fetching Weather...</strong></div></div>`
  );
  setTimeout(window.scrollTo(0, 0), 200);
}
function removeFetchingMsg() {
  let msgBoxes = document.getElementsByClassName('fetching-msgs');
  if (msgBoxes) {
    Array.from(msgBoxes).forEach((ele) => {
      document.body.removeChild(ele);
    });
  }
}

//update weather from city
async function updateWeatherFromCity(city) {
  addFetchingMsg();
  try {
    //obtaining city coordis and info
    const coordinates = await getCoordinates(city);
    const { latitude, longitude, name, state } = coordinates[0];

    let fetchWeather = getCurrentWeather(latitude, longitude);
    let fetchAQI = getAQI(city);
    let fetchWeekWeatherList = getWeekWeather(latitude, longitude);

    Promise.all([fetchWeather, fetchAQI, fetchWeekWeatherList])
      .then((responses) => {
        const [weatherObj, aqi, weekWeatherList] = responses;
        removeFetchingMsg();
        updateUI(null, weatherObj, aqi, weekWeatherList, name, state);
      })
      .catch((error) => {
        removeFetchingMsg();
        updateUI(new Error(error.message));
      });
  } catch (error) {
    removeFetchingMsg();
    if (
      error.message ==
      `Cannot destructure property 'latitude' of 'coordinates[0]' as it is undefined.`
    )
      error.message = 'API Server is down';
    updateUI(new Error(error.message));
  }
}

// degC and degF btns onclick listerners
//update temp based on units
function updateTemp(tempUnit, fromUnit) {
  if (fromUnit == tempUnit) return;
  Array.from(tempValueBoxes).forEach((box) => {
    let prevValue = Number.parseFloat(box.innerHTML);
    let newValue;
    if (tempUnit == 'degC') newValue = ((prevValue - 32) * 5) / 9;
    else newValue = prevValue * 1.8 + 32;
    newValue = Math.round((newValue + Number.EPSILON) * 10) / 10;
    box.innerHTML = `${newValue}`;
  });

  Array.from(tempUnitBoxes).forEach((box) => {
    if (tempUnit == 'degC') box.innerHTML = `℃`;
    else box.innerHTML = `℉`;
  });
}

degCBtn.addEventListener('click', () => {
  if (tempUnit == 'degC') return;
  tempUnit = 'degC';
  degFBtn.classList.remove('temp-unit-active');
  degCBtn.classList.add('temp-unit-active');
  updateTemp(tempUnit);
});

degFBtn.addEventListener('click', () => {
  if (tempUnit == 'degF') return;
  tempUnit = 'degF';
  degCBtn.classList.remove('temp-unit-active');
  degFBtn.classList.add('temp-unit-active');
  updateTemp(tempUnit);
});

//location icon event listener
currLocatorBtn.addEventListener('click', () => {
  __init__();
});

//search event listener
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  let searchCity = searchBar.value.trim();
  searchBar.value = '';
  searchBar.blur();
  if (searchCity.length > 1) {
    updateWeatherFromCity(encodeURI(searchCity))
      .then(() => {
        currentWeatherCity = searchCity;
      })
      .catch((error) => {
        updateUI(new Error(error.message));
      });
  }
});

//update weather from current location or default location
function __init__() {
  fetchCurrentLocation()
    .then((coords) => {
      const { latitude, longitude } = coords;
      return getCity(latitude, longitude);
    })
    .then((responeCity) => {
      currentWeatherCity = responeCity;
    })
    .catch((error) => {
      updateUI(new Error(error.message));
    })
    .then(() => updateWeatherFromCity(currentWeatherCity));
}

//update time
(() => {
  setInterval(() => {
    const { day, time } = getDate();

    mainDayBox.innerHTML = `${day}`;
    mainTimeBox.innerHTML = `${time}`;
  }, 1000);
})();
if (!navigator.geolocation) {
  updateUI(new Error('no location facility available'));
}

__init__();
