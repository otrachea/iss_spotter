const request = require("request-promise-native");
require("dotenv").config();

const fetchMyIP = () => {
  return request("https://api.ipify.org?format=json");
};

const fetchCoordsByIP = (body) => {
  return request(`https://api.freegeoip.app/json/${JSON.parse(body).ip}?&apikey=${process.env.API_KEY}`)
};

const fetchISSFlyOverTimes = (coords) => {
  let { latitude, longitude } = JSON.parse(coords);
  return request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`)
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((times) => {
    return JSON.parse(times).response;
  })
};

module.exports = {nextISSTimesForMyLocation };