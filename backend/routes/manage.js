var express = require('express');
var router = express.Router();
const {getTournamentToManage, postScores} = require('../controllers/manageController');


router.route('/:tournamentName/round/:roundNumber').get(getTournamentToManage).post(postScores);



module.exports = router