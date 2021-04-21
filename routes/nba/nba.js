/**
* routes/nba/nba.js
*
* @description:: This gets called at /api/v1/espn/ffl.
* Handles all API calls related to ESPN Fantasy Football.
*
*/

const express = require('express');

// controllers
const nbaController = require('../../controllers/nba/nbaController.js');

const router = express.Router();

// Get Player Details
router.get('/player/:playerName', (req, res, next) => {
  nbaController.getPlayerDetails(req, res, next)
});

// Get League Leaders for stat
router.get('/leaders/:statCategory', (req, res, next) => {
  nbaController.getLeagueLeaders(req, res, next)
});

exports.router = router;