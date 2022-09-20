const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(401)
      .send({ message: "Incorrect username or password", isLogged: false });
  }

  if (await bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign({ user }, process.env.JWT_SECRET);

    return res.status(200).json({ isLogged: true, accessToken: accessToken });
  } else {
    return res
      .status(401)
      .send({ message: "Incorrect username or password", isLogged: false });
  }
};

// const register = (req, res, next) => {
//     bcrypt.hash('', 10, function(err, hashedPass){
//         if(err){
//             res.json({ error: err})
//         }

//         let user = new User({
//             username: '',
//             password: hashedPass
//         })
//         user.save().then(user => {
//             console.log(user, 'saved')
//         }).catch(error => console.log(error))
//     })
// }

const authenticateToken = (req, res, next) => {
  var token = req.headers.authorization.split(" ")[1];

  if (token == null) res.status(401);

  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) res.status(403);
    req.user = user;
    if (req.user) next();
    else res.status(403).send("Token required");
  });
};

module.exports = { login, authenticateToken };
