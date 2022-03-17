const { nextISSTimesForMyLocation } = require("./iss");

nextISSTimesForMyLocation((err, times) => {
  if (err) {
    console.log("Error:", err);
    return;
  }

  for (const time of times) {
    console.log(`Next pass at ${new Date(time.risetime * 1000)} for ${time.duration} seconds!`);
  }
});