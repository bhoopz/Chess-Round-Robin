var express = require('express');
var router = express.Router();
const {getAllPlayers, createTournament, addNewPlayer,} = require('../controllers/tournamentController');

router.route('/').get(getAllPlayers).post(createTournament);
router.route('/add').post(addNewPlayer);

module.exports = router;