const Player = require('../models/player');
const {Tournament} = require('../models/tournament');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = config.SECRET;

const getAllTournaments = (req, res) => {
    Tournament.find().sort({createdAt: -1})
    .then(result => {
        res.json(result.splice(0,10));
    })
    .catch(error => console.log(error))
}


const getTournament = async (req, res) => {
    try{
        await Tournament.find({name: req.params.tournamentName}).populate({
            path: `rounds.pairs`,
            populate:{
                path: 'pair'
            },
        }).populate({
            path: 'players', 
            populate: {
                path: 'player',
    
            }
        })
        .then(result => {
            res.json(result[0])
        })
        .catch(error => console.log(error))
    }catch(error){
        console.log(error)
    }
    
}

const loginInfo = async (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    const user = await User.findOne({ username });
    if(!user){
        return res.status(401).send({ error: 'Incorrect username or password' });
    }
    
    if(await bcrypt.compare(password, user.password)){

        req.session.userID = user._id;

        const token = jwt.sign({id: user._id, username: user.username}, JWT_SECRET)
        req.session.userToken = token;


        return res.status(200).json({ token: token});
    }else{
        return res.json({ status: 'error', token: '' });
    }
    
}

const ifLogged = (req, res) => {
    
    if(req.session.userID){
        res.send({token: req.session.userToken})
    }else{
        res.send({token: ''})
    }
}

const logout = (req, res) => {
    if (req.session) {
        req.session.destroy();
    }

    res.send({ msg: 'Logged out successfully' });
}




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


module.exports = {
    getAllTournaments,
    getTournament,
    loginInfo,
    ifLogged,
    logout,
}