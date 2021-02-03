/**
* /routes/espn/index.js
*
* @description:: This route gets called at /api/v1/espn.
* Handles all ESPN API calls
*
*/

const express = require('express');
const ffl = require('./ffl');

const router = express.Router();

router.use('/ffl', ffl.router);

exports.router = router;
