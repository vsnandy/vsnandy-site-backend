/**
* /routes/nba/index.js
*
* @description:: This route gets called at /api/v1/nba.
* Handles all NBA API calls
*
*/

const express = require('express');
const nba = require('./nba');

const router = express.Router();

router.use('/', nba.router);

exports.router = router;
