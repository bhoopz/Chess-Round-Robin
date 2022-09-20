const { Tournament } = require("../models/tournament");
require("dotenv").config();

const getAllTournaments = async (req, res) => {
  try {
    const result = await Tournament.find().sort({ createdAt: -1 });
    res.status(200).json(result.splice(0, 10));
  } catch (err) {
    console.log(err);
  }
};

const getTournament = async (req, res) => {
  try {
    const result = await Tournament.find({ name: req.params.tournamentName })
      .populate({
        path: `rounds.pairs`,
        populate: {
          path: "pair",
        },
      })
      .populate({
        path: "players",
        populate: {
          path: "player",
        },
      });
    res.status(200).json(result[0]);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllTournaments,
  getTournament,
};
