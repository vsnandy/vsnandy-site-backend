/**
* /utils/helper.js
*
* @description:: Helper file that contains reusable functions
*
*/

// Complete ESPN FFL URL path w/ League ID and Season ID
exports.getFflPath = (leagueId, seasonId) => {
  return `seasons/${seasonId}/segments/0/leagues/${leagueId}`;
}
