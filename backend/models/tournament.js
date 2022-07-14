const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const playersSchema = new Schema({
    player:{
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true,        
    },
    generalScore:{
        type: Number,
        required: true,
        default: 0
    },
    pointsEarned:{
        type: Number,
        required: true,
        default: 0
    }
})

const pairSchema = new Schema({
    pair:{
        type: [Schema.Types.ObjectId],
        ref: 'Player',
        validate: [arrayLimit],
        required: true
    },
    score:{
        type: [Number],
        validate: [arrayLimit],
        required: true,
        default: [0,0]
    },
    ratingPoints:{
        type: [Number],
        validate: [arrayLimit],
        required: true,
        default: [0,0]
    }
})

const roundSchema = new Schema({
    pairs: [pairSchema],
    roundOver: {
        type: Boolean,
        required: true,
        default: false
    }
})

const tournamentSchema = new Schema({
    name: { 
        type: String,
        required: true
    },
    players: [playersSchema],
    rounds: [roundSchema],
    typeOfTournament: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date, 
        default: new Date()
    }
})

function arrayLimit(val) {
    return val.length <= 2;
}


const Tournament = mongoose.model('Tournament', tournamentSchema);
module.exports = {Tournament};