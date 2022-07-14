const {Tournament} = require('../models/tournament');
const Player = require('../models/player');
var EloRating = require('elo-rating');

const getTournament = (req, res) => {

    Tournament.findOne({name: req.params.tournamentName}).populate({
        path: `rounds.pairs`,
        populate:{
            path: 'pair'
        }
    })
    .then(result => {
        if(result==null){
            res.send('No data');
        } else{
            res.json(result);
        }
        
    }).catch(error => res.send('No data'));
}

const postScores = async (req, res) => {
    let scores = req.body.scores
    let roundNumber = req.body.roundNumber
    let tournamentName = req.params.tournamentName
    let decision = req.body.decision

    for (let i = 0; i < scores.length; i++){
        await Tournament.findOneAndUpdate({name: tournamentName}, {$set: {[`rounds.${roundNumber-1}.pairs.${i}.score`]: scores[i], [`rounds.${roundNumber-1}.roundOver`]: true } })
    }
    // ADD ROUND SCORES TO GENERAL SCORE
    await Tournament.findOne({name: tournamentName}, (err, tournament) => {
        if(err){console.log(err)}

        tournament.players.map(itemPlayer => {
            tournament.rounds[roundNumber-1].pairs.map(itemPair => {
                
                for(let i = 0; i < 2; i++){
                    if(itemPlayer.player.toString() == itemPair.pair[i].toString()){
                        let newScore = itemPlayer.generalScore + itemPair.score[i]
                        Tournament.findOneAndUpdate({name: tournamentName, 'players.player': itemPlayer.player}, {$set: {'players.$.generalScore': newScore}}, (err) => {if(err){console.log(err)}})
                    }
                }            
            })
        })
    }).clone().catch(function(err){ console.log(err)})

    // CALCULATE POINTS AND ADD TO RATING POINTS
    await Tournament.findOne({name: tournamentName}, (err, tournament) =>{
        if(err){console.log(err)}
        let whichElo =''

        if(tournament.typeOfTournament == 'Blitz'){
            whichElo = 'blitzElo'
        }else if(tournament.typeOfTournament == 'Rapid'){
            whichElo = 'rapidElo'
        }else{
            whichElo = 'standardElo'
        }

            tournament.rounds[roundNumber-1].pairs.map(async (itemPair, index) => {

                if(itemPair.score.includes(1)){
                    let winnerElo = itemPair.pair[itemPair.score.indexOf(1)][whichElo];
                    let loserElo = itemPair.pair[itemPair.score.indexOf(0)][whichElo];
                    let result = EloRating.calculate(winnerElo, loserElo);
                    let arrayOfEarnedPoints = []
                    arrayOfEarnedPoints[itemPair.score.indexOf(1)] = result.playerRating - winnerElo
                    arrayOfEarnedPoints[itemPair.score.indexOf(0)] = result.opponentRating - loserElo

                    await Tournament.findOneAndUpdate({name: tournamentName}, {$set: {[`rounds.${roundNumber-1}.pairs.${index}.ratingPoints`]: arrayOfEarnedPoints}}, (err) => {if(err){console.log(err)}}).clone().catch(function(err){ console.log(err)});
                    
                }else{
                    let firstPlayerElo = itemPair.pair[0][whichElo];
                    let secondPlayerElo = itemPair.pair[1][whichElo];
                    let arrayOfEarnedPoints = drawCondition(firstPlayerElo, secondPlayerElo);

                    await Tournament.findOneAndUpdate({name: tournamentName}, {$set: {[`rounds.${roundNumber-1}.pairs.${index}.ratingPoints`]: arrayOfEarnedPoints}}, (err) => {if(err){console.log(err)}}).clone().catch(function(err){ console.log(err)});
                }
                // ADD POINTS FROM ROUND ARRAY TO TOTAL EARNED POINTS 
                Tournament.findOne({name: req.params.tournamentName}, (err, tournament) => {
                    if(err){console.log(err)}
            
                    tournament.players.map(itemPlayer => {
                        tournament.rounds[roundNumber-1].pairs.map(itemPair => {
                            
                            for(let i = 0; i < 2; i++){
                                if(itemPlayer.player.toString() == itemPair.pair[i].toString()){
                                    let totalPointsEarned = itemPlayer.pointsEarned + itemPair.ratingPoints[i]
                                    Tournament.findOneAndUpdate({name: tournamentName, 'players.player': itemPlayer.player}, {$set: {'players.$.pointsEarned': totalPointsEarned}}, (err) => {if(err){console.log(err)}})
                                }
                            }

                        })
                    })
                })
            })

    }).populate({path:'rounds', populate:{path:'pairs', populate:{path:'pair'}}}).clone().catch(function(err){ console.log(err)});

    if(decision){
        
        await Tournament.findOne({name: tournamentName}, (err, tournament) =>{
            if(err){console.log(err)}

            tournament.players.map(itemPlayer => {
                let whichElo =''

        if(tournament.typeOfTournament == 'Blitz'){
            whichElo = 'blitzElo'
        }else if(tournament.typeOfTournament == 'Rapid'){
            whichElo = 'rapidElo'
        }else{
            whichElo = 'standardElo'
        }
                newElo = itemPlayer.player[whichElo] + itemPlayer.pointsEarned
                Player.findOneAndUpdate({_id: itemPlayer.player._id}, {$set: {[`${whichElo}`]: newElo}},(err) => {if(err){console.log(err)}}) 
            })
        }).populate({path: 'players', populate:{path: 'player'}}).clone().catch(function(err){ console.log(err)})
    }

}


function drawCondition(firstPlayerElo, secondPlayerElo){
    let result = EloRating.calculate(firstPlayerElo, secondPlayerElo,0);
    let result2 = EloRating.calculate(firstPlayerElo, secondPlayerElo)

    return [parseInt((result.playerRating - firstPlayerElo)/2 + (result2.playerRating - firstPlayerElo)/2), parseInt((result.opponentRating - secondPlayerElo)/2 + (result2.opponentRating - secondPlayerElo)/2)]
}

module.exports = {getTournament, postScores};