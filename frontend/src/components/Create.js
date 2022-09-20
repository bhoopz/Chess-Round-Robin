import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  MenuItem,
} from "@material-ui/core";
import Table from "./Table";
import { useNavigate } from "react-router-dom";
import { getPlayers } from "../services/PlayerService";
import { createTournament } from "../services/TournamentService";
import AddPlayer from "./AddPlayer";

export default function Create() {
  const [type, setType] = useState("");
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [arrayOfPlayers, setArrayOfPlayers] = useState([]);
  const [tournamentName, setTournamentName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      const res = await getPlayers(query);
      setData(res.data);
    };
    fetchPlayers();
  }, [query]);

  useEffect(() => {
    if (!localStorage.getItem("TOKEN")) {
      navigate("/");
    }
  }, []);

  async function addTournament() {
    if (tournamentName.length < 8) {
      setErrorMessage("Please enter at least 8 characters tournament name");
    } else if (/^\d+$/.test(tournamentName)) {
      setErrorMessage("Incorrect tournament name");
    } else {
      try {
        const res = await createTournament({
          arrayOfPlayers: arrayOfPlayers,
          tournamentName: tournamentName,
          type: type,
        });
        if (res.status === 200) {
          navigate(`/manage/${res.data}/round/1`);
        }
      } catch (err) {
        setErrorMessage(err.response.data.message);
      }
    }
  }

  return (
    <Grid container spacing={1} align="center">
      <Grid item xs={12}>
        <Typography component="h4" variant="h4">
          Create Tournament
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl>
          <TextField
            margin="normal"
            label="Tournament Name"
            id="outlined-size-normal"
            variant="outlined"
            required={true}
            onChange={(e) => setTournamentName(e.target.value)}
            error={errorMessage.length > 0}
            helperText={errorMessage}
          />

          <TextField
            select
            variant="outlined"
            label="Tournament Type"
            value={type}
            required={true}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value={"Blitz"}>Blitz</MenuItem>
            <MenuItem value={"Rapid"}>Rapid</MenuItem>
            <MenuItem value={"Standard"}>Standard</MenuItem>
          </TextField>

          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            ADD PLAYER
          </Button>

          <TextField
            margin="normal"
            label="Search..."
            id="outlined-size-normal"
            variant="outlined"
            onChange={(e) => setQuery(e.target.value)}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        {<Table data={data} setArrayOfPlayers={setArrayOfPlayers} />}
        <Button
          variant="contained"
          disabled={arrayOfPlayers.length < 4 || type.length === 0}
          onClick={addTournament}
        >
          CREATE TOURNAMENT
        </Button>
        <AddPlayer openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </Grid>
    </Grid>
  );
}
