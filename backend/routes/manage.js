var express = require('express');
var router = express.Router();
const {getTournament, postScores} = require('../controllers/manageController')

router.route('/:tournamentName/round/:roundNumber').get(getTournament).post(postScores);



module.exports = router