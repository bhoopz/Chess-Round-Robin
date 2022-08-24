var express = require('express');
var router = express.Router();
const {getAllTournaments, getTournament, loginInfo, ifLogged, logout, isUserAuth} = require('../controllers/indexController');



/* GET home page. */

router.route('/').get(getAllTournaments)
router.route('/tournament/:tournamentName').get(getTournament);
router.route('/login').post(loginInfo).get(ifLogged);
router.route('/logout').get(logout);



module.exports = router;
