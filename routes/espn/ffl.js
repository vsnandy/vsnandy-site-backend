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
router.get('/league/:leagueId/season/:seasonId/settings', async (req, res, next) => {
  await leagueController.getLeagueSettings(req, res, next)
});

// Gets the teams & their basic info (no roster)
router.get('/league/:leagueId/season/:seasonId/teams', async (req, res, next) => {
  await leagueController.getTeams(req, res, next);
});

// Get weekly matchup data (points by team and roster)
router.get('/league/:leagueId/season/:seasonId/scoringPeriod/:scoringPeriodId/matchupPeriod/:matchupPeriodId', async (req, res, next) => {
  await leagueController.getMatchupsForWeek(req, res, next);
});

// Get a specific team's points by week
router.get('/league/:leagueId/season/:seasonId/scoringPeriod/:scoringPeriodId/team/:teamId', async (req, res, next) => {
  await leagueController.getTeamForWeek(req, res, next);
});

// Get the boxscores for each week and detailed roster scores for specified scoring period
router.get('/league/:leagueId/season/:seasonId/scoringPeriod/:scoringPeriodId/boxscores', async (req, res, next) => {
  await leagueController.getBoxscoresForWeek(req, res, next);
});

// Get the matchups and scores by week (no roster or team details)
router.get('/league/:leagueId/season/:seasonId/scores', async (req, res, next) => {
  await leagueController.getAllScores(req, res, next);
});

// Try getting ESPN Constants via web scrape
router.get('/web-constants', async (req, res, next) => {
  await leagueController.getConstants(req, res, next);
});

exports.router = router;
