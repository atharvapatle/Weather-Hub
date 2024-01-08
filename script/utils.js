//fetch current location
async function fetchCurrentLocation() {
  try {
    let geoLocationResponse = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    return geoLocationResponse.coords;
  } catch (error) {
    console.log('fetchCurrentLocation: ' + error);
    throw Error('location acess denied');
  }
}

//get coordinate of any city
async function getCoordinates(city) {
  try {
    const coordiResponse = await fetch(
      `https://geocoding-by-api-ninjas.p.rapidapi.com/v1/geocoding?city=${city}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key':
            '0530cf6c28msh94aa70d15f750b4p15f03ejsn513cc5a41c6c',
          'X-RapidAPI-Host': 'geocoding-by-api-ninjas.p.rapidapi.com',
        },
      }
    );
    const jsonCoordiResponse = await coordiResponse.json();
    console.log(jsonCoordiResponse);
    if (jsonCoordiResponse.length == 0 || jsonCoordiResponse == undefined)
      throw Error('Unable to fetch location');
    return jsonCoordiResponse;
  } catch (error) {
    console.log(' getCoordinates: ' + error);
    throw Error('Unable to fetch location');
  }
}

//get city from coordinate
async function getCity(lat, lon) {
  try {
    const cityResponse = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    const cityResponseJson = await cityResponse.json();
    return cityResponseJson.city;
  } catch (error) {
    console.log('get city: ' + error);
    throw Error('Unable to fetch current location');
  }
}

//get currentWeather
async function getCurrentWeather(lat, lon) {
  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=1044777a0e1e64e9b729285bc0579326`
    );
    const jsonWeatherResponse = await weatherResponse.json();
    return jsonWeatherResponse;
  } catch (error) {
    console.log('get curr weather: ' + error);
    throw Error('Unable to fetch weather');
  }
}

//get week data
async function getWeekWeather(lat, lon) {
  try {
    const weekWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=1044777a0e1e64e9b729285bc0579326`
    );
    const weekWeatherResponseJson = await weekWeatherResponse.json();

    const weekData = [weekWeatherResponseJson.list[0]];

    weekWeatherResponseJson.list.forEach((item) => {
      if (
        new Date(item.dt * 1000).getDay() !=
        new Date(weekData[weekData.length - 1].dt * 1000).getDay()
      )
        weekData.push(item);
    });
    if (new Date(weekData[0].dt * 1000).getDay() == new Date().getDay())
      weekData.shift();

    //weekData is the data for the current week
    return weekData;
  } catch (error) {
    console.log('get week weather: ' + error);
    throw Error('Unable to fetch Week weather');
  }
}

//get aqi
async function getAQI(city) {
  try {
    const aqiResponse = await fetch(
      `https://air-quality-by-api-ninjas.p.rapidapi.com/v1/airquality?city=${city}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key':
            '0530cf6c28msh94aa70d15f750b4p15f03ejsn513cc5a41c6c',
          'X-RapidAPI-Host': 'air-quality-by-api-ninjas.p.rapidapi.com',
        },
      }
    );
    let aqiResponseJson = await aqiResponse.json();
    return aqiResponseJson;
  } catch (error) {
    console.log('fetcg aqi: ' + error);
    throwError('Unable to fetch AQI');
  }
}

//date formatter
function getDate(UTC) {
  const day_map = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
  };

  let date;
  if (UTC) {
    date = new Date(UTC * 1000);
  } else {
    date = new Date();
  }

  let hours = Number.parseInt(date.getHours().toString());
  let am_pm = hours >= 12 ? 'PM' : 'AM';
  hours = hours > 12 ? hours - 12 : hours;
  const day = day_map[date.getDay()];

  const time = `${hours.toString().length == 1 ? '0' + hours : hours}:${
    date.getMinutes().toString().length == 1
      ? '0' + date.getMinutes()
      : date.getMinutes()
  } ${am_pm}`;
  return { date, day, time };
}
