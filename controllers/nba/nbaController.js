/**
* /controllers/nba/nbaController.js
*
* @description:: Controller for generic league info.
* Passes data from the service to the route.
*
*/

const nbaService = require('../../services/nba/nbaService.js');

exports.getPlayerDetails = (req, res, next) => {
  const { playerName } = req.params;

  try {
    nbaService.getPlayerDetails(playerName, (playerDetails) => {
      res.status(200).json({
        data: playerDetails
      });
      next();
    });
  } catch (err) {
    next(err);
  }
}