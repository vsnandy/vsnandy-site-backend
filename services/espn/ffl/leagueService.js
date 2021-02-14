/*
* /services/espn/ffl/leagueService.js
*
* @description:: This service worker handles all
* external ESPN API calls related to an FFL league
*
*/

const dotenv = require('dotenv');
const axios = require('axios');
const htmlParser = require('node-html-parser');

const { ErrorHandler } = require('../../../utils/error.js');
const { getFflPath } = require('../../../utils/helper.js');

dotenv.config(); // get the environment variables

// set default headers
const options = {
  headers: {
    Cookie: `espn_s2=${process.env.ESPN_S2};SWID=${process.env.SWID}`,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
};

// Get the league settings
exports.getLeagueSettings = async (leagueId, seasonId) => {
  try {
    const path = getFflPath(leagueId, seasonId);
    const response = await axios.get(`${path}?view=mSettings`, options);

    return response.data;
  } catch(err) {
    throw new ErrorHandler(400, 'Unable to get league settings');
  }
}

// Get the members & teams
exports.getTeams = async (leagueId, seasonId) => {
  try {
    const path = getFflPath(leagueId, seasonId);
    const response = await axios.get(`${path}?view=mTeam`, options);
    const teams = response.data;
    return {
      members: teams.members,
      teams: teams.teams
    }
  } catch (err) {
    throw new ErrorHandler(400, 'Unable to get league teams');
  }
}

// Get weekly matchup data (points by team and roster breakdown)
exports.getMatchupsForWeek = async (leagueId, seasonId, scoringPeriodId, matchupPeriodId) => {
  try {
    const path = getFflPath(leagueId, seasonId);
    const response = await axios.get(`${path}?view=mMatchup&view=mMatchupScore&scoringPeriodId=${scoringPeriodId}`, options);
    
    // Grab the "schedule" node from the response
    const schedule = response.data.schedule;

    // filter down to the selected matchup period
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

    return matchups;
  } catch (err) {
    throw new ErrorHandler(400, 'Unable to get matchups for week');
  }
}

// Get roster and points for specific team at week
exports.getTeamForWeek =  async (leagueId, seasonId, scoringPeriodId, teamId) => {
  try {
    const path = getFflPath(leagueId, seasonId);
    const response = await axios.get(`${path}?forTeamId=${teamId}&scoringPeriodId=${scoringPeriodId}&view=mTeam&view=mRoster`, options);

    return {
      member: response.data.members[0],
      team: response.data.teams[0]
    };
  } catch (err) {
    throw new ErrorHandler(400, `Unable to get details for team ${teamId}`);
  }
}

// Get boxscores for week and roster details for given scoring period
exports.getBoxscoresForWeek = async (leagueId, seasonId, scoringPeriodId) => {
  try {
    const path = getFflPath(leagueId, seasonId);
    const response = await axios.get(`${path}?view=mBoxscore&scoringPeriodId=${scoringPeriodId}`, options);
    
    return response.data.schedule;
  } catch (err) {
    throw new ErrorHandler(400, `Unable to get boxscores for week ${scoringPeriodId}`);
  }
}

// Get scores for all weeks
exports.getAllScores = async (leagueId, seasonId) => {
  try {
    const path = getFflPath(leagueId, seasonId);
    const response = await axios.get(`${path}?view=mLiveScoring&view=mMatchupScore`, options);

    return response.data.schedule;
  } catch (err) {
    throw new ErrorHandler(400, 'Unable to get all scores for league');
  }
}

// Get all active players for league and season
const getAllPlayers = async (seasonId) => {
  try {
    const moreOptions = {
      headers: {
        ...options.headers,
        "x-fantasy-filter": JSON.stringify({
          "filterActive": {
            "value": true
          }
        })
      }
    };

    //console.log(moreOptions);

    const response = await axios.get(`https://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/players?view=players_wl`, moreOptions);

    console.log("Total Players: " + response.data.length);
    return response.data;
  } catch (err) {
    throw new ErrorHandler(400, 'Unable to get all players');
  }
}

exports.getAllPlayers = getAllPlayers;

// Get a player's info for season  by their name
exports.getPlayerInfoByName = async (seasonId, playerName) => {
  try {
    // first grab all players and then filter
    console.log("Player to find: " + playerName);
    const allPlayers = await getAllPlayers(seasonId);
    const players = allPlayers.filter(p => p.fullName === playerName);
    console.log("Players found: " + players.length);
    return players;
  } catch (err) {
    throw new ErrorHandler(400, `Unable to get ${playerName}`);
  }
}

// Get a player's stats for given week, season, and league
exports.getPlayerStatsForWeek = async (leagueId, seasonId, scoringPeriodId, playerId) => {
  try {
    const moreOptions = {
      headers: {
        ...options.headers,
        "x-fantasy-filter": JSON.stringify({
          "players": {
            "filterIds": {
              "value": [playerId]
            },
            "filterStatsForTopScoringPeriodIds": {
              "value": 16,
              "additionalValue": [`00${seasonId}`, `10${seasonId}`]
            }
          }
        })
      }
    };

    const path = getFflPath(leagueId, seasonId);
    const response = await axios.get(`${path}?view=kona_playercard`, moreOptions);

    return response.data;
  } catch (err) {
    throw new ErrorHandler(400, `Unable to get stats for player: ${playerId}`);
  }
}

// Get the top 50 scorers for a given week and positions
exports.getTopScorersForWeek = async (leagueId, seasonId, scoringPeriodId, positionIds) => {
  try {
    const moreOptions = {
      headers: {
        ...options.headers,
        "x-fantasy-filter": JSON.stringify({
          "players": {
            "filterSlotIds": {
              "value": [...positionIds]
            },
            "sortPercOwned": {
              "sortPriority": 3,
              "sortAsc": false
            },
            "filterStatsForCurrentSeasonScoringPeriodId": {
              "value": [scoringPeriodId]
            },
            "limit": 50,
            "offset": 0,
            "sortAppliedStatTotalForScoringPeriodId": {
              "sortAsc": false,
              "sortPriority": 1,
              "value": scoringPeriodId
            },
            "filterRanksForScoringPeriodIds": {
              "value": [scoringPeriodId]
            }, 
            "filterRanksForRankTypes": {
              "value": ["STANDARD"]
            },
            "filterRanksForSlotIds": {
              "value": [0,2,4,6,17,16]
            }
          }
        })
      }
    }

    const path = getFflPath(leagueId, seasonId);
    const response = await axios.get(`${path}?view=kona_player_info`, moreOptions);

    // Add combined stats fields for ease of use in client-side app
    const players = response.data.players.map(p => {
      const real = p.player.stats.find(s => s.statSourceId === 0);
      const proj = p.player.stats.find(s => s.statSourceId === 1);

      const realStats = {
        appliedTotal: real ? real.appliedTotal : 0,
        stats: real ? real.stats : {}
      };
      const projStats = {
        appliedTotal: proj ? proj.appliedTotal : 0,
        stats: proj ? proj.stats : {}
      };

      return {
        ...p,
        combinedStats: {
          realStats,
          projStats
        }
      };
    });

    return {players, positionAgainstOpponent: response.data.positionAgainstOpponent};
  } catch (err) {
    console.log(err);
    throw new ErrorHandler(400, 'Unable to get top scorers');
  }
}

// Get positional standings for a range of scoring periods
exports.getTopScorersForWeeks = async (leagueId, seasonId, scoringPeriodIds, positionIds) => {
  try {
    const moreOptions = {
      headers: {
        ...options.headers,
        "x-fantasy-filter": JSON.stringify({
          "players": {
            "filterSlotIds": {
              "value": [...positionIds]
            },
            "filterStatsForCurrentSeasonScoringPeriodId": {
              "value": [...scoringPeriodIds]
            },
            "limit": -1,
            "offset": 0,
            "filterRanksForScoringPeriodIds": {
              "value": [...scoringPeriodIds]
            }, 
            "filterRanksForRankTypes": {
              "value": ["STANDARD"]
            },
            "filterRanksForSlotIds": {
              "value": [0,2,4,6,17,16]
            }
          }
        })
      }
    }
    //console.log(moreOptions);

    const path = getFflPath(leagueId, seasonId);
    const response = await axios.get(`${path}?view=kona_player_info`, moreOptions);

    // reducer function to aggregate stats and points
    const statsReducer = (acc, val) => {
      const combinedStats = {...acc.stats};
      for(const key in val.stats) {
        if(key in combinedStats) {
          combinedStats[key] += val.stats[key];
        } else {
          combinedStats[key] = val.stats[key];
        }
      }

      return {
        appliedTotal: acc.appliedTotal + val.appliedTotal,
        stats: combinedStats
      };
    }

    // Loop through all players and aggregate their points/stats for given week range (real and proj)
    let players = response.data.players.map(p => {
      let realStats = p.player.stats.filter(s => s.statSourceId === 0 && s.statSplitTypeId === 1);
      let projStats = p.player.stats.filter(s => s.statSourceId === 1 && s.statSplitTypeId === 1);

      // if no stats, assign 0
      if(realStats.length === 0) {
        realStats.push(
          {
            appliedTotal: 0,
            stats: {}
          }
        );
      }

      if(projStats.length === 0) {
        projStats.push(
          {
            appliedTotal: 0,
            stats: {}
          }
        );
      }

      // only need appliedTotal and stats fields so loop through each stat
      realStats = realStats.map(s => {
        return {
          appliedTotal: s.appliedTotal,
          stats: s.stats
        }
      });

      projStats = projStats.map(s => {
        return {
          appliedTotal: s.appliedTotal,
          stats: s.stats
        }
      });

      return {
        ...p,
        combinedStats: {
          realStats: realStats.reduce(statsReducer),
          projStats: projStats.reduce(statsReducer)
        }
      };
    });

    // Finally, sort (descending) the players by realStats.appliedTotal & return top 50
    players = players.sort((a, b) => (
      b.combinedStats.realStats.appliedTotal 
      - a.combinedStats.realStats.appliedTotal
    )).slice(0, 50);

    return {players, positionAgainstOpponent: response.data.positionAgainstOpponent};
  } catch (err) {
    throw new ErrorHandler(400, 'Unable to get top scorers for given weeks.');
  }
}

// Get ESPN FFL constants via web-scrape
exports.getConstants = async () => {
  try {
    const response = await axios.get('https://fantasy.espn.com/football/boxscore');
    
    // Parse the desired data sections
    const root = htmlParser.parse(response.data);
    const KONA = root.querySelector('body').childNodes[2];
    const KONA_JSON = KONA.childNodes[0].rawText.trim().split("__KONA_SERIALIZATION_DATA__=")[1];

    const NEXT = root.querySelector('body').childNodes[3];
    const NEXT_JSON = NEXT.childNodes[0].rawText.trim().split("__NEXT_DATA__ = ")[1].split("\n")[0];
    
    return {
      kona: JSON.parse(KONA_JSON),
      next_data: JSON.parse(NEXT_JSON)
    };
  } catch (err) {
    throw new ErrorHandler(400, 'Unable to get constants from ESPN');
  }
}

