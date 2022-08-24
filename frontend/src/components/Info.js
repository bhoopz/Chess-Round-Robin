import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import { Grid } from "@material-ui/core"


function Info() {
  
  const [data, setData] = useState([])
  const [rounds, setRounds] = useState('')
  const [players, setPlayers] = useState('')
  let params = useParams()
  const tournamentName = params.tournamentName
  let [elo, setElo] = useState('')

  useEffect(() =>{
    const fetchTournament = async () => {
        const res = await axios.get(`/tournament/${tournamentName}`);
        setData(res.data);
        setRounds(res.data.rounds)
        setPlayers(res.data.players)
        if(res.data.typeOfTournament == 'Standard'){
            setElo('standardElo')
        }else if(res.data.typeOfTournament == 'Rapid'){
            setElo('rapidElo')
        }else{
            setElo('blitzElo')
        }
    }
    fetchTournament();
  }, [])

  const displayInfo = () => {
    if(rounds === undefined){
        return
    }

      if(rounds.length > 0){
        return(
            <Grid container spacing={2}>
                <Grid item xs={12} md={6} align="center">
                    <table>
                        <tbody>
                            {rounds.map((item, index) => {
                                return(
                                    <tr key={index}>
                                        <td>
                                            <h3>{'Round ' + parseInt(index+1)}</h3>
                                            {item.pairs.map((pair, index) => {
                                                return(<table key={index}><tbody><tr>
                                                    <td>
                                                    <span>
                                                        {pair.pair[0].name} {`(${pair.pair[0][elo]})`} 
                                                        {item.roundOver ? (pair.ratingPoints[0] < 0 ? `(${pair.ratingPoints[0]})` : `(+${pair.ratingPoints[0]})`) : null} 
                                                        {pair.score[0]} 
                                                    </span>
                                                    <span>
                                                        {pair.score[1]} {pair.pair[1].name} {`(${pair.pair[1][elo]})`} 
                                                        {item.roundOver ? (pair.ratingPoints[1] < 0 ? `(${pair.ratingPoints[1]})` : `(+${pair.ratingPoints[1]})`) : null}
                                                    </span>
                                                    </td>
                                                   </tr></tbody></table>)
                                                   
                                            })}
                                            
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Grid>
                <Grid item xs={12} md={6} align="center">
                    <table>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <th>{data.typeOfTournament} Elo</th>
                                <th>Score</th>
                                <th>Earned Elo</th>
                            </tr>
                            {players.sort(function(a, b) {
                                return a.generalScore - b.generalScore;
                            }).reverse().map((item, index) => {
                                return(
                                <tr key={index}>
                                    <td>{item.player.name} </td>
                                    <td>{item.player[elo]}</td>
                                    <td>{item.generalScore}</td>
                                    <td>{item.pointsEarned}</td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Grid>
            </Grid>
          )
      }
      
  }

  return (
    <div className="Home">
        <h1>{tournamentName}</h1>
        <h2>{data ? data.typeOfTournament : null}</h2>
        {displayInfo()}
    </div>
  );
}

export default Info;
