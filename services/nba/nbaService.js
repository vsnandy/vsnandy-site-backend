/*
* /services/nba/nbaService.js
*
* @description:: This service worker handles all
* external NBA API calls related to an FFL league
*
*/
const { spawn } = require('child_process');

const { ErrorHandler } = require('../../utils/error.js');

// Get the player details
exports.getPlayerDetails = (playerName, callback) => {
  try {
    //console.log(playerName);
    let process = spawn('python', [
      './services/nba/scripts/nba.py',
      'player_details', // python function to use
      playerName // parameter
    ]);
    let response = {};

    process.stdout.on('data', (data) => {
      //console.log(data.toString())
      response = JSON.parse(data.toString());
    });

    process.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    process.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      return callback(response);
    });
  } catch(err) {
    throw new ErrorHandler(400, 'Unable to get player details.');
  }
}