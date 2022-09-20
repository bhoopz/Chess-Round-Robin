import React, { useEffect, useState } from "react";
import { Button, Grid } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import { getAllTournaments } from "../services/TournamentService";

function Home() {
  const [data, setData] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      const res = await getAllTournaments();
      setData(res.data);
    };
    fetchTournaments();
  }, []);

  useEffect(() => {
    setIsLogged(localStorage.getItem("ISLOGGED"));
  }, []);

  function logout() {
    localStorage.removeItem("ISLOGGED");
    localStorage.removeItem("TOKEN");
    setIsLogged(false);
  }

  return (
    <Grid container spacing={1}>
      {isLogged ? (
        <div>
          <Button onClick={logout} variant="contained">
            Log out
          </Button>
          <Button
            onClick={() => navigate("/create-tournament")}
            variant="contained"
          >
            Create tournament
          </Button>
          <table>
            <tbody>
              <tr>
                <th>
                  <h2>Manage</h2>
                </th>
              </tr>
              {data.map((item, index) => {
                for (var i = 0; i < item.rounds.length; i++) {
                  for (var j = 0; j < item.rounds.length; j++) {
                    if (!item.rounds[j].roundOver) {
                      return (
                        <tr key={index}>
                          <td>
                            <a
                              href={`/manage/${item.name}/round/${parseInt(
                                j + 1
                              )}`}
                            >
                              {item.name}
                            </a>
                          </td>
                        </tr>
                      );
                    }
                  }
                }
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Login setIsLogged={setIsLogged} />
      )}

      <Grid item xs={12}>
        <div className="Home">
          <table>
            <tbody>
              <tr>
                <th>All tournaments</th>
              </tr>
              {data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <a href={`/tournaments/${item.name}`}>{item.name}</a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Grid>
    </Grid>
  );
}

export default Home;
