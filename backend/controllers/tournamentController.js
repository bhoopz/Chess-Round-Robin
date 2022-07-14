const Player = require('../models/player');
const {Tournament} = require('../models/tournament');
var robin = require('roundrobin');

const getAllPlayers = (req, res) =>{

    const { q } = req.query;

    const keys = ["name", "federation", "sex"];

    const search = (data) => {
        return data.filter((item) => 
        keys.some((key) => item[key].toLowerCase().includes(q) || 
        item[key].toUpperCase().includes(q) || 
        item[key].includes(q))
        )
    };

    Player.find().sort({standardElo: 1})
    .then(result => {
        res.json(search(result).splice(0,10))
        
    })
    .catch(error => console.log(error))
}

const createTournament = async (req, res) =>{
    let tournamentName = req.body.tournamentName;
    let arrayOfPlayers = req.body.arrayOfPlayers;
    let type = req.body.type;
    let playersPairs = robin(arrayOfPlayers.length, arrayOfPlayers);
    let reversedPlayersPairs = arraySwitch(JSON.parse(JSON.stringify(playersPairs)));
    let readyPlayersPairs = pairAdd([...playersPairs, ...reversedPlayersPairs]);

    const foundTournament = await Tournament.find({name: new RegExp('^'+tournamentName+'$', "i")})

    if(foundTournament.length != 0){
        return res.sendStatus(400)
    }else{
        const tournament = new Tournament({
            name: tournamentName,
            players: playerAdd(arrayOfPlayers),
            rounds: pairsAdd(readyPlayersPairs),
            typeOfTournament: type
        })
        
        await tournament.save().then(tournament => {
            res.send(tournament.name);
            }, err => {
            res.status(400).send(err);
            });
    } 
}

const addNewPlayer = async (req, res) =>{
    let firstName = req.body.name;
    let lastName = req.body.lastName;
    let name = `${lastName}, ${firstName}`;
    let federation = req.body.federation;
    let sex = req.body.sex;
    let birthYear = req.body.birthYear;

    const player = new Player({
        name: name,
        federation: federation,
        birthYear: birthYear,
        sex: sex,
        blitzElo: 1000,
        rapidElo: 1000,
        standardElo: 1000,
    })

    await player.save().then(() => {
        res.status(200).send();
       }, err => {
        res.status(400).send(err);
       });
}

function arraySwitch(arr) {
    for(let i=0; i<arr.length; i++){
        for(let j=0; j<2; j++){
            let element = arr[i][j][1];
            arr[i][j].splice(1, 1);
            arr[i][j].splice(0, 0, element);
        }
    }
    return arr
}

const playerAdd = (array) =>{
    return array.map((obj) =>{
    return {
      'player': obj
    }
  })
  }

  const pairAdd = (array) =>{
    return array.map((row, obj) =>{
        return row.map((column) => {
            return {
              'pair': column
            }
        })
    
  })
  }

  const pairsAdd = (array) =>{
      return array.map((row) =>{
          return {
              'pairs': row
          }
      })
  }


module.exports = {
    getAllPlayers,
    createTournament,
    addNewPlayer,
}