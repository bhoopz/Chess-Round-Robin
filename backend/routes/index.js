var express = require('express');
var router = express.Router();
const {getAllTournaments, getTournament} = require('../controllers/indexController');


/* GET home page. */
router.route('/').get(getAllTournaments);
router.route('/tournament/:tournamentName').get(getTournament);


module.exports = router;
