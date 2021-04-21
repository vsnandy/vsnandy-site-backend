/**
* /routes/index.js
*
* @description:: This pulls in all the subroutes 
* and exposes them at the corresponding path
*
*/

const express = require('express');
const espn = require('./espn');
const football = require('./football');
const nba = require('./nba');

const router = express.Router();

router.use('/espn', espn.router);
router.use('/football', football.router);
router.use('/nba', nba.router);

module.exports = router;
