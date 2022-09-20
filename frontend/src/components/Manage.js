import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Grid, makeStyles } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {
  getTournamentRoundPair,
  postTournamentRoundScores,
} from "../services/TournamentService";

export default function Manage() {
  let params = useParams();
  const tournamentName = params.tournamentName;
  const roundNumber = params.roundNumber;
  let [pairs, setPairs] = useState("");
  let [scores, setScores] = useState([]);
  let [endRound, setEndRound] = useState(false);
  const [lastRound, setLastRound] = useState("");
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const useStyles = makeStyles({
    leftButton: {
      backgroundColor: "white",
      border: "2px solid",
    },
    rightButton: {
      backgroundColor: "black",
      color: "white",
    },
    drawButton: {
      background: "linear-gradient(45deg, white 30%, black 90%)",
      margin: 15,
    },
  });

  const classes = useStyles();

  useEffect(() => {
    if (!localStorage.getItem("TOKEN")) {
      navigate("/");
    }
  }, []);

  const getPairs = async () => {
    try {
      const result = await getTournamentRoundPair(tournamentName, roundNumber);
      setPairs(result.data.rounds[roundNumber - 1].pairs);
      setEndRound(result.data.rounds[roundNumber - 1].roundOver);
      setLastRound(result.data.rounds.length);
    } catch (err) {
      console.log(err);
    }
  };

  const displayPairs = () => {
    if (pairs.length > 0) {
      return (
        <Grid container spacing={1} align="center">
          <Grid item xs={12}>
            <h1>
              Round {roundNumber} of {lastRound}
            </h1>
            <table>
              <tbody>
                {pairs.map((pair, index) => {
                  return (
                    <tr key={index}>
                      <td>{pair.pair[0].name}</td>
                      {endRound ? (
                        <React.Fragment>
                          <td>{pair.score[0]}</td>
                          <td>{pair.score[1]}</td>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <td>
                            {
                              <Button
                                className={classes.leftButton}
                                onClick={() => {
                                  leftWin(index);
                                }}
                              >
                                WIN
                              </Button>
                            }
                          </td>
                          <td>
                            {
                              <Button
                                className={classes.drawButton}
                                onClick={() => {
                                  draw(index);
                                }}
                              >
                                DRAW
                              </Button>
                            }
                          </td>
                          <td>
                            {
                              <Button
                                className={classes.rightButton}
                                onClick={() => {
                                  rightWin(index);
                                }}
                              >
                                WIN
                              </Button>
                            }
                          </td>
                        </React.Fragment>
                      )}
                      <td>{pair.pair[1].name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Grid>
        </Grid>
      );
    } else {
      return <h1>404 not found</h1>;
    }
  };

  function leftWin(index) {
    scores[index] = [1, 0];
  }
  function rightWin(index) {
    scores[index] = [0, 1];
  }
  function draw(index) {
    scores[index] = [0.5, 0.5];
  }

  async function sendRoundInfo(decision) {
    try {
      const res = await postTournamentRoundScores(tournamentName, roundNumber, {
        scores: scores,
        roundNumber: roundNumber,
        decision: decision,
      });
      if (res.status === 200) {
        lastRound != roundNumber
          ? navigate(
              `/manage/${tournamentName}/round/${parseInt(roundNumber) + 1}`
            )
          : navigate(`/tournament/${tournamentName}`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getPairs();
  }, [params]);

  return (
    <div className="Home">
      {displayPairs()}
      {endRound & (lastRound !== roundNumber) ? (
        <Button
          variant="contained"
          onClick={() =>
            navigate(
              `/manage/${tournamentName}/round/${parseInt(roundNumber) + 1}`
            )
          }
        >
          NEXT ROUND
        </Button>
      ) : (
        <Button
          color="secondary"
          variant="contained"
          disabled={endRound || !pairs}
          onClick={
            lastRound == roundNumber
              ? () => setOpenDialog(true)
              : () => sendRoundInfo(false)
          }
        >
          END ROUND
        </Button>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>{"Do you want to save ranking points?"}</DialogTitle>
            <DialogContent>
              <Button onClick={() => sendRoundInfo(true)} variant="contained">
                Yes
              </Button>
              <Button onClick={() => sendRoundInfo(false)} variant="contained">
                No
              </Button>
            </DialogContent>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
}
