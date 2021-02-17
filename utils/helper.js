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

// Convert epoch time to CST
exports.convertEpochToCST = (time) => {
  var d = new Date(time);
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
  var nd = new Date(utc + (3600000*-6));
  return nd.toLocaleString();
}

// Format date from M/D/YYYY to YYYYMMDD
exports.formatDate = (date) => {
  const userDate = new Date(date);
  const y = userDate.getFullYear().toString();
  let m = (userDate.getMonth() + 1).toString();
  let d = userDate.getDate().toString();
  if (m.length == 1) {
    m = '0' + m;
  }
  if (d.length == 1) {
    d = '0' + d;
  }
  return y + m + d;
}