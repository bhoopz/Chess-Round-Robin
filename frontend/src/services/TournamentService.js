import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export const getAllTournaments = () => {
  return axios.get(url);
};

export const createTournament = (data) => {
  return axios.post(url + "create-tournament", data);
};

export const getSingleTournament = (tournamentName) => {
  return axios.get(url + `tournaments/${tournamentName}`);
};

export const getTournamentRoundPair = (tournamentName, roundNumber) => {
  return axios.get(url + "manage/" + tournamentName + "/round/" + roundNumber);
};

export const postTournamentRoundScores = (
  tournamentName,
  roundNumber,
  data
) => {
  return axios.post(
    url + "manage/" + tournamentName + "/round/" + roundNumber,
    data
  );
};
