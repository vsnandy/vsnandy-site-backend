/**
* /controllers/nba/nbaController.js
*
* @description:: Controller for NBA info.
* Passes data from the service to the route.
*
*/

const nbaService = require('../../services/nba/nbaService.js');

exports.getPlayerDetails = (req, res, next) => {
  const { playerName } = req.params;

  try {
    nbaService.getPlayerDetails(playerName, (playerDetails) => {
      res.status(200).json({
        data: JSON.parse(playerDetails)
      });
      next();
    });
  } catch (err) {
    next(err);
  }
}

exports.getLeagueLeaders = (req, res, next) => {
  const { statCategory } = req.params;

  try {
    nbaService.getLeagueLeaders(statCategory, (leaders) => {
      res.status(200).json({
        data: JSON.parse(leaders)
      });
      next();
    });
  } catch (err) {
    next(err);
  }
}