/**
* routes/espn/ffl.js
*
* @description:: This gets called at /api/v1/espn/ffl.
* Handles all API calls related to ESPN Fantasy Football.
*
*/

const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const htmlParser = require('node-html-parser');
const constants = require('../../constants/espn');

// controllers
const leagueController = require('../../controllers/espn/ffl/leagueController.js');

const router = express.Router();

dotenv.config();

const options = {
  headers: {
    Cookie: `espn_s2=${process.env.ESPN_S2};SWID=${process.env.SWID}`,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  },
};

axios.defaults.baseURL = 'https://fantasy.espn.com/apis/v3/games/ffl/';
axios.defaults.withCredentials = true;
axios.defaults.headers = options;

// Get the League Settings
router.get('/league/:leagueId/season/:seasonId/settings', (req, res, next) => {
  leagueController.getLeagueSettings(req, res, next)
});

// Gets the teams & their basic info (no roster)
router.get('/league/:leagueId/season/:seasonId/teams', (req, res, next) => {
  leagueController.getTeams(req, res, next);
});

// Get weekly matchup data (points by team and roster)
router.get('/league/:leagueId/season/:seasonId/scoringPeriod/:scoringPeriodId/matchupPeriod/:matchupPeriodId', (req, res, next) => {
  leagueController.getMatchupsForWeek(req, res, next);
});

// Get a specific team's points by week
router.get('/league/:leagueId/season/:seasonId/scoringPeriod/:scoringPeriodId/team/:teamId', (req, res, next) => {
  leagueController.getTeamForWeek(req, res, next);
});

// Get the boxscores for each week and detailed roster scores for specified scoring period
router.get('/league/:leagueId/season/:seasonId/scoringPeriod/:scoringPeriodId/boxscores', (req, res, next) => {
  leagueController.getBoxscoresForWeek(req, res, next);
});

// Get the matchups and scores by week (no roster or team details)
router.get('/league/:leagueId/season/:seasonId/scores', (req, res, next) => {
  leagueController.getAllScores(req, res, next);
});

// Get all players for league and season
router.get('/season/:seasonId/players', (req, res, next) => {
  leagueController.getAllPlayers(req, res, next);
});

// Get simple player info for given player
router.get('/season/:seasonId/player/:playerName', (req, res, next) => {
  leagueController.getPlayerInfoByName(req, res, next);
});

// Get a player by name for a given week
router.get('/league/:leagueId/season/:seasonId/scoringPeriod/:scoringPeriodId/player/:playerName', (req, res, next) => {
  leagueController.getPlayerStatsForWeek(req, res, next);
});

// Get top players at a position for a given week
router.get('/league/:leagueId/season/:seasonId/scoringPeriod/:scoringPeriodId/position/:position/topScorers', (req, res, next) => {
  leagueController.getTopScorersForWeek(req, res, next);
});

// Get top players at a position for a range of weeks
router.get('/league/:leagueId/season/:seasonId/startWeek/:startWeek/endWeek/:endWeek/position/:position/topScorers', (req, res, next) => {
  leagueController.getTopScorersForWeeks(req, res, next);
});

// Try getting ESPN Constants via web scrape
router.get('/web-constants', (req, res, next) => {
  leagueController.getConstants(req, res, next);
});

exports.router = router;
