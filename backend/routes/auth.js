var express = require("express");
var router = express.Router();
const { login } = require("../controllers/authController");

router.route("/login").post(login);

module.exports = router;
