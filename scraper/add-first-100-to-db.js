const jsonString = require('./first-100-data.json');
const Player = require('./models/player');
const mongoose = require('mongoose');
var config = require('./config')

const dbURI = config.URL;
mongoose.connect(dbURI).then( (result) => console.log('connected') ).catch( (error) => console.log(error));

const start = async () => {

            const player = JSON.parse(JSON.stringify(jsonString))
            for await (const element of player.Players){
                const player = new Player({
                    name: element.name,
                    federation: element.federation,
                    birthYear: element.birth_year,
                    sex: element.sex,
                    title: element.title,
                    standardElo: element.standard_elo,
                    rapidElo: element.rapid_elo,
                    blitzElo: element.blitz_elo,
                    worldRankAllPlayers: element.world_rank_all_players,
                    worldRankActivePlayers: element.world_rank_active_players,
                    nationalRankAllPlayers: element.national_rank_all_players,
                    nationalRankActivePlayers: element.national_rank_active_players,
                    continentalRankAllPlayers: element.continental_rank_all_players,
                    continentalRankActivePlayers: element.continental_rank_active_players                   
                })
                player.save()
                .then((result) => console.log('added'))
                .catch((error) => console.log(error))
            }   
}
start()