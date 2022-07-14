const Player = require('../models/player');
const {Tournament} = require('../models/tournament');

const getAllTournaments = (req, res) => {
    Tournament.find().sort({createdAt: -1})
    .then(result => {
        res.json(result.splice(0,10));
    })
    .catch(error => console.log(error))
}


const getTournament = (req, res) => {
    Tournament.find({name: req.params.tournamentName}).populate({
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
}


module.exports = {
    getAllTournaments,
    getTournament
}