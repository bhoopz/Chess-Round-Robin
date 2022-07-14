const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const playerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    federation: {
        type: String,
        required: true
    },
    birthYear: {
        type: Number,
        required: true
    },
    sex: {
        type: String,   
        required: true
    },
    title: {
        type: String
    },
    standardElo: {
        type: Number
    },
    rapidElo: {
        type: Number
    },
    blitzElo: {
        type: Number
    },
    worldRankAllPlayers: {
        type: Number
    },
    worldRankActivePlayers: {
        type: Number
    },
    nationalRankAllPlayers: {
        type: Number
    },
    nationalRankActivePlayers: {
        type: Number
    },
    continentalRankAllPlayers: {
        type: Number
    },
    continentalRankActivePlayers: {
        type: Number
    }
});
 
const Player = mongoose.model('Player', playerSchema);
module.exports = Player;