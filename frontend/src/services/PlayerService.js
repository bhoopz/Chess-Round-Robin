import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export const getPlayers = (query) => {
  return axios.get(url + `create-tournament?q=${query}`);
};

export const createPlayer = (data) => {
  return axios.post(url + "create-tournament/add", data);
};
