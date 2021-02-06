/**
* /controllers/espn/ffl/leagueController.js
*
* @description:: Controller for generic league info.
* Passes data from the service to the route.
*
*/

const leagueService = require('../../../services/espn/ffl/leagueService.js');

// Get the League Settings
exports.getLeagueSettings = async (req, res, next) => {
  const { leagueId, seasonId } = req.params;

  try {
    // Call service
    const leagueSettings = await leagueService.getLeagueSettings(leagueId, seasonId);

    res.status(200).json({
      data: leagueSettings
    });
    next();
  } catch (err) {
    next(err);
  }
}

// Get the members, teams, and their basic info
exports.getTeams = async (req, res, next) => {
  const { leagueId, seasonId } = req.params;

  try {
    // Call service
    const teams = await leagueService.getTeams(leagueId, seasonId);
    
    res.status(200).json({
      data: teams
    });
    next();
  } catch (err) {
    next(err);
  }
}

// Get the weekly matchups for team with roster breakdown
exports.getMatchupsForWeek = async (req, res, next) => {
  const { leagueId, seasonId, scoringPeriodId, matchupPeriodId } = req.params;

  try {
    // Call service
    const matchups = await leagueService.getMatchupsForWeek(leagueId, seasonId, scoringPeriodId, matchupPeriodId);

    res.status(200).json({
      data: matchups
    });
    next();
  } catch (err) {
    next(err);
  }
}

// Get roster and points for specific team at week
exports.getTeamForWeek = async (req, res, next) => {
  const { leagueId, seasonId, teamId, scoringPeriodId } = req.params;
  
  try {
    // Call service
    const team = await leagueService.getTeamForWeek(leagueId, seasonId, scoringPeriodId, teamId);

    res.status(200).json({
      data: team
    });
    next();
  } catch (err) {
    next(err);
  }
}

// Get boxscore by week and roster details for given scoring period
exports.getBoxscoresForWeek = async (req, res, next) => {
  const { leagueId, seasonId, scoringPeriodId } = req.params;

  try {
    // Call service
    const boxscores = await leagueService.getBoxscoresForWeek(leagueId, seasonId, scoringPeriodId);

    res.status(200).json({
      data: boxscores
    });
    next();
  } catch (err) {
    next(err);
  }
}

// Get the matchups and scores by week (no roster or team details)
exports.getAllScores = async (req, res, next) => {
  const { leagueId, seasonId } = req.params;

  try {
    // Call service
    const scores = await leagueService.getAllScores(leagueId, seasonId);

    res.status(200).json({
      data: scores
    });
    next();
  } catch (err) {
    next(err);
  }
}

// Get all players
exports.getAllPlayers = async (req, res, next) => {
  const { seasonId } = req.params;

  try {
    const players = await leagueService.getAllPlayers(seasonId);

    res.status(200).json({
      data: players
    });
    next();
  } catch (err) {
    next(err);
  }
}

// Get simple player info for given player and given season
exports.getPlayerInfoByName = async (req, res, next) => {
  const { seasonId, playerName } = req.params;

  try {
    const playerInfo = await leagueService.getPlayerInfoByName(seasonId, playerName);

    res.status(200).json({
      data: playerInfo
    });
    next();
  } catch (err) {
    next(err);
  }
}

// Get player by name for given week
exports.getPlayerStatsForWeek = async (req, res, next) => {
  const { leagueId, seasonId, scoringPeriodId, playerName } = req.params;

  try {
    // Call service to get Player ID
    const playerInfo = await leagueService.getPlayerInfoByName(seasonId, playerName);
    const playerId = playerInfo[0].id; // for now use the first player found
    console.log("Player ID found: " + playerId);
    const playerStats = await leagueService.getPlayerStatsForWeek(leagueId, seasonId, scoringPeriodId, playerId);

    res.status(200).json({
      data: playerStats
    });
    next();
  } catch (err) {
    next(err);
  }
}

// Get the ESPN FFL constants via web-scrape
exports.getConstants = async (req, res, next) => {
  try {
    // Call service
    const constants = await leagueService.getConstants();

    res.status(200).json({
      data: constants
    });
    next();
  } catch (err) {
    next(err);
  }
}


