const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const htmlParser = require('node-html-parser');
const constants = require('../constants/espn');

const router = express.Router();

dotenv.config();

axios.defaults.baseURL = 'https://fantasy.espn.com/apis/v3/games/ffl/';
axios.defaults.withCredentials = true;

const options = {
  headers: {
    Cookie: `espn_s2=${process.env.ESPN_S2};SWID=${process.env.SWID}`,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  },
};

// Get basic league info
router.get('/league/:leagueId/season/:seasonId/basic', async (req, res) => {
  let { leagueId, seasonId } = req.params;

  try {
    const response = await axios.get(`seasons/${seasonId}/segments/0/leagues/${leagueId}`, options);
    res.status(200).json({
      data: response.data
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred",
      err
    });
  }
});

// Get league settings
router.get('/league/:leagueId/season/:seasonId/settings', async (req, res) => {
  let { leagueId, seasonId } = req.params;

  try {
    const response = await axios.get(`seasons/${seasonId}/segments/0/leagues/${leagueId}?view=mSettings`, options);
    res.status(200).json({
      data: response.data
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred",
      err
    });
  }
});

// Gets the teams & their basic info (no roster)
router.get('/league/:leagueId/season/:seasonId/teams', async (req, res) => {
  let { leagueId, seasonId } = req.params;

  try {
    // grab the teams data
    const response = await axios.get(`seasons/${seasonId}/segments/0/leagues/${leagueId}?view=mTeam`, options);

    // filter out the teams array
    const teams = response.data;

    res.status(200).json({
      data: {
        members: teams.members,
        teams: teams.teams
      }
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred",
      err
    });
  }
});

// Get weekly matchup data (points by team and roster)
router.get('/league/:leagueId/season/:seasonId/scoringPeriod/:scoringPeriodId/matchupPeriod/:matchupPeriodId', async (req, res) => {
  let { leagueId, seasonId, scoringPeriodId, matchupPeriodId } = req.params;

  try {
    // grab the matchup data for all weeks
    const response = await axios.get(`seasons/${seasonId}/segments/0/leagues/${leagueId}?view=mMatchup&view=mMatchupScore&scoringPeriodId=${scoringPeriodId}`, options);

    // grab the "schedule" node from the response
    const schedule = response.data.schedule;

    //filter down to the selected matchup period
    const matchups = schedule.filter(e => e.matchupPeriodId === Number(matchupPeriodId));

    // Remove the "rankings" node from each player object
    matchups.forEach(m => {
      // Go through away teams players first
      if('away' in m) {
        m.away.rosterForCurrentScoringPeriod.entries.forEach(p => {
          delete p.playerPoolEntry.player.rankings;
        });

        m.away.rosterForMatchupPeriod.entries.forEach(p => {
          delete p.playerPoolEntry.player.rankings;
        });
      }

      if('home' in m) {
        m.home.rosterForCurrentScoringPeriod.entries.forEach(p => {
          delete p.playerPoolEntry.player.rankings;
        });

        m.home.rosterForMatchupPeriod.entries.forEach(p => {
          delete p.playerPoolEntry.player.rankings;
        });
      }
    });

    res.status(200).json({
      data: matchups
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred",
      err
    });
  }
});

// Get a specific team's points by week
router.get('/league/:leagueId/season/:seasonId/scoringPeriod/:scoringPeriodId/team/:teamId', async (req, res) => {
  let { leagueId, seasonId, teamId, scoringPeriodId } = req.params;

  try {
    const response = await axios.get(`seasons/${seasonId}/segments/0/leagues/${leagueId}?forTeamId=${teamId}&scoringPeriodId=${scoringPeriodId}&view=mRoster&view=mTeam`, options);
    const data = {member: response.data.members[0], team: response.data.teams[0]};

    res.status(200).json({
      data: data
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred",
      err
    });
  }
});

// Get the boxscores for each week and detailed roster scores for specified scoring period
router.get('/league/:leagueId/season/:seasonId/scoringPeriod/:scoringPeriodId/boxscores', async (req, res) => {
  let { leagueId, seasonId, scoringPeriodId } = req.params;

  try {
    const response = await axios.get(`seasons/${seasonId}/segments/0/leagues/${leagueId}?view=mBoxscore&scoringPeriodId=${scoringPeriodId}`, options);
    res.status(200).json({
      data: response.data.schedule
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred",
      err
    });
  }
});

// Get the matchups and scores by week (no roster or team details)
router.get('/league/:leagueId/season/:seasonId/scores', async (req, res) => {
  let { leagueId, seasonId } = req.params;

  try {
    const response = await axios.get(`seasons/${seasonId}/segments/0/leagues/${leagueId}?view=mLiveScoring&view=mMatchupScore`, options);
    res.status(200).json({
      data: response.data.schedule
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occurred",
      err
    });
  }
});

// Get the ESPN Constants
router.get('/constants', async (req, res) => {
  try {
    res.status(200).json({
      data: constants.constants
    });
  } catch (err) {
    res.status(400).json({
      message: "Some",
      err
    });
  }
});

// Try getting ESPN Constants via web scrape
router.get('/web-constants', async (req, res) => {
  try {
    // Grab the underlying html from ESPN
    const response = await axios.get('https://fantasy.espn.com/football/boxscore');

    // Parse the desired data sections
    const root = htmlParser.parse(response.data);
    const KONA = root.querySelector('body').childNodes[2];
    const KONA_JSON = KONA.childNodes[0].rawText.trim().split("__KONA_SERIALIZATION_DATA__=")[1];

    const NEXT = root.querySelector('body').childNodes[3];
    const NEXT_JSON = NEXT.childNodes[0].rawText.trim().split("__NEXT_DATA__ = ")[1].split("\n")[0];

    res.status(200).json({
      kona: JSON.parse(KONA_JSON),
      next_data: JSON.parse(NEXT_JSON)
    });
  } catch(err) {
    res.status(400).json({
      message: "Some error occurred",
      err
    });
  }
})

exports.router = router;