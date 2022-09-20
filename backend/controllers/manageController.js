const { Tournament } = require("../models/tournament");
const Player = require("../models/player");
var EloRating = require("elo-rating");

const getTournamentToManage = async (req, res) => {
  try {
    const tournament = await Tournament.findOne({
      name: req.params.tournamentName,
    }).populate({
      path: `rounds.pairs`,
      populate: {
        path: "pair",
      },
    });
    if (!tournament) {
      return res.status(404).send({ message: "404 not found" });
    }
    res.status(200).json(tournament);
  } catch (err) {
    console.log(err);
  }
};

const postScores = async (req, res) => {
  let scores = req.body.scores;
  let roundNumber = req.body.roundNumber;
  let tournamentName = req.params.tournamentName;
  let decision = req.body.decision;

  try {
    const promise = await Promise.all([
      enterScores(scores, tournamentName, roundNumber),
      addToGeneralScores(tournamentName, roundNumber),
      calculateAndAddPoints(tournamentName, roundNumber, decision),
    ]);
    return res.status(200).send(promise);
  } catch (err) {
    return res.status(400).send({ message: "Promises error" });
  }
};

function drawCondition(firstPlayerElo, secondPlayerElo) {
  let result = EloRating.calculate(firstPlayerElo, secondPlayerElo, 0);
  let result2 = EloRating.calculate(firstPlayerElo, secondPlayerElo);

  return [
    parseInt(
      (result.playerRating - firstPlayerElo) / 2 +
        (result2.playerRating - firstPlayerElo) / 2
    ),
    parseInt(
      (result.opponentRating - secondPlayerElo) / 2 +
        (result2.opponentRating - secondPlayerElo) / 2
    ),
  ];
}

async function enterScores(scores, tournamentName, roundNumber) {
  try {
    for (let i = 0; i < scores.length; i++) {
      await Tournament.findOneAndUpdate(
        { name: tournamentName },
        {
          $set: {
            [`rounds.${roundNumber - 1}.pairs.${i}.score`]: scores[i],
            [`rounds.${roundNumber - 1}.roundOver`]: true,
          },
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
}

async function addToGeneralScores(tournamentName, roundNumber) {
  // ADD ROUND SCORES TO GENERAL SCORE
  try {
    const tournament = await Tournament.findOne({
      name: tournamentName,
    });

    tournament.players.map((itemPlayer) => {
      tournament.rounds[roundNumber - 1].pairs.map(async (itemPair) => {
        for (let i = 0; i < 2; i++) {
          if (itemPlayer.player.toString() == itemPair.pair[i].toString()) {
            let newScore = itemPlayer.generalScore + itemPair.score[i];
            await Tournament.findOneAndUpdate(
              { name: tournamentName, "players.player": itemPlayer.player },
              { $set: { "players.$.generalScore": newScore } }
            );
          }
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
}

async function calculateAndAddPoints(tournamentName, roundNumber, decision) {
  // CALCULATE POINTS AND ADD TO RATING POINTS
  const tournament = await Tournament.findOne({
    name: tournamentName,
  }).populate({
    path: "rounds",
    populate: { path: "pairs", populate: { path: "pair" } },
  });
  let whichElo = "";

  if (tournament.typeOfTournament == "Blitz") {
    whichElo = "blitzElo";
  } else if (tournament.typeOfTournament == "Rapid") {
    whichElo = "rapidElo";
  } else {
    whichElo = "standardElo";
  }

  tournament.rounds[roundNumber - 1].pairs.map(async (itemPair, index) => {
    if (itemPair.score.includes(1)) {
      let winnerElo = itemPair.pair[itemPair.score.indexOf(1)][whichElo];
      let loserElo = itemPair.pair[itemPair.score.indexOf(0)][whichElo];
      let result = EloRating.calculate(winnerElo, loserElo);
      let arrayOfEarnedPoints = [];
      arrayOfEarnedPoints[itemPair.score.indexOf(1)] =
        result.playerRating - winnerElo;
      arrayOfEarnedPoints[itemPair.score.indexOf(0)] =
        result.opponentRating - loserElo;

      await Tournament.findOneAndUpdate(
        { name: tournamentName },
        {
          $set: {
            [`rounds.${roundNumber - 1}.pairs.${index}.ratingPoints`]:
              arrayOfEarnedPoints,
          },
        }
      )
        .clone()
        .catch(function (err) {
          console.log(err);
        });
    } else {
      let firstPlayerElo = itemPair.pair[0][whichElo];
      let secondPlayerElo = itemPair.pair[1][whichElo];
      let arrayOfEarnedPoints = drawCondition(firstPlayerElo, secondPlayerElo);

      await Tournament.findOneAndUpdate(
        { name: tournamentName },
        {
          $set: {
            [`rounds.${roundNumber - 1}.pairs.${index}.ratingPoints`]:
              arrayOfEarnedPoints,
          },
        }
      )
        .clone()
        .catch(function (err) {
          console.log(err);
        });
    }
    // ADD POINTS FROM ROUND ARRAY TO TOTAL EARNED POINTS
    await addPointsToTotal(tournamentName, roundNumber);
    await saveRankings(tournamentName, decision);
  });
}

async function addPointsToTotal(tournamentName, roundNumber) {
  const tournament = await Tournament.findOne({ name: tournamentName });

  tournament.players.map((itemPlayer) => {
    tournament.rounds[roundNumber - 1].pairs.map(async (itemPair) => {
      for (let i = 0; i < 2; i++) {
        if (itemPlayer.player.toString() == itemPair.pair[i].toString()) {
          let totalPointsEarned =
            itemPlayer.pointsEarned + itemPair.ratingPoints[i];
          await Tournament.findOneAndUpdate(
            {
              name: tournamentName,
              "players.player": itemPlayer.player,
            },
            { $set: { "players.$.pointsEarned": totalPointsEarned } }
          );
        }
      }
    });
  });
}

async function saveRankings(tournamentName, decision) {
  if (decision) {
    const tournament = await Tournament.findOne({
      name: tournamentName,
    }).populate({ path: "players", populate: { path: "player" } });

    tournament.players.map(async (itemPlayer) => {
      let whichElo = "";

      if (tournament.typeOfTournament == "Blitz") {
        whichElo = "blitzElo";
      } else if (tournament.typeOfTournament == "Rapid") {
        whichElo = "rapidElo";
      } else {
        whichElo = "standardElo";
      }
      newElo = itemPlayer.player[whichElo] + itemPlayer.pointsEarned;
      await Player.findOneAndUpdate(
        { _id: itemPlayer.player._id },
        { $set: { [`${whichElo}`]: newElo } }
      );
    });
  }
}

module.exports = { getTournamentToManage, postScores };
