const express = require('express');
const dotenv = require('dotenv');
const fantasy = require('espn-fantasy-football-api/node');

const router = express.Router();

dotenv.config();

// Get the league info for the given season
router.get('/league/:leagueId/season/:seasonId/info', async (req, res) => {
  let { leagueId, seasonId } = req.params;

  // Create the FFL Client
  const myClient = new fantasy.Client({ leagueId });
  myClient.setCookies({ espnS2: process.env.ESPN_S2, SWID: process.env.SWID });

  try {
    // make the API call
    const response = await myClient.getLeagueInfo({ seasonId });
    res.status(200).json({
      data: response
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred",
      err
    });
  }
});

// Get the FFL Teams at the given season & scoring period
router.get("/league/:leagueId/season/:seasonId/scoringPeriod/:scoringPeriodId", async (req, res) => {
  let { leagueId, seasonId, scoringPeriodId } = req.params;

  // Create the FFL Client
  const myClient = new fantasy.Client({ leagueId });
  myClient.setCookies({ espnS2: process.env.ESPN_S2, SWID: process.env.SWID });

  try {
    // make the API call
    const response = await myClient.getTeamsAtWeek({ seasonId, scoringPeriodId });
    res.status(200).json({
      data: response
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred",
      err
    });
  }
});

// Get the Free Agents for the given season and scoring period
router.get("/league/:leagueId/season/:seasonId/scoringPeriod/:scoringPeriodId/freeAgents", async (req, res) => {
  let { leagueId, seasonId, scoringPeriodId } = req.params;

  // Create the FFL client
  const myClient = new fantasy.Client({ leagueId });
  myClient.setCookies({ espnS2: process.env.ESPN_S2, SWID: process.env.SWID });

  try {
    const response = await myClient.getFreeAgents({ seasonId, scoringPeriodId });
    res.status(200).json({
      data: response
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred",
      err
    });
  }
});

// Get the Boxscore for the given scoring period & matchup period
router.get("/league/:leagueId/season/:seasonId/scoringPeriod/:scoringPeriodId/matchupPeriod/:matchupPeriodId/scores", async (req, res) => {
  let { leagueId, seasonId, scoringPeriodId, matchupPeriodId } = req.params;

  // Create the FFL Client
  const myClient = new fantasy.Client({ leagueId });
  myClient.setCookies({ espnS2: process.env.ESPN_S2, SWID: process.env.SWID });
  
  try {
    // Make the API Call
    const response = await myClient.getBoxscoreForWeek({ seasonId, matchupPeriodId, scoringPeriodId });
    res.status(200).json({
      data: response
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred",
      err
    });
  }
});

exports.router = router;