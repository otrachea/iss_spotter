const request = require("request");
require("dotenv").config();

const fetchMyIP = (f) => {
  request("https://api.ipify.org?format=json", (err, response, body) => {

    if (err) {
      f(err, null);
      return;
    }

    if (response.statusCode !== 200) {
      f(Error(`Status code ${response.statusCode} when fetching IP. Response ${body}`), null);
      return;
    }

    f(null, JSON.parse(body).ip);
  });
};

const fetchCoordsByIP = (ip, f) => {
  request(`https://api.freegeoip.app/json/${ip}?&apikey=${process.env.API_KEY}`, (err, response, body) => {

    if (err) {
      f(err, null);
      return;
    }

    if (response.statusCode !== 200) {
      f(Error(`Status code ${response.statusCode} when fetching coordinates. Response ${body}`), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body);
    f(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = (coords, f) => {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (err, response, body) => {

    if (err) {
      f(err, null);
      return;
    }

    if (response.statusCode !== 200) {
      f(Error(`Status code ${response.statusCode} when fetching fly over times. Response ${body}`), null);
      return;
    }

    f(null, JSON.parse(body).response);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((err, ip) => {
    if (err) {
      callback(`Error:, ${err}`, null);
      return;
    }

    fetchCoordsByIP(ip, (err, coords) => {
      if (err) {
        callback(`Error:, ${err}`, null);
        return;
      }

      fetchISSFlyOverTimes(coords, (err, times) => {
        if (err) {
          callback(`Error:, ${err}`, null);
          return;
        }

        callback(null, times);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };