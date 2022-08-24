import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import { Button, Grid, makeStyles } from "@material-ui/core"
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Cookies from "universal-cookie";


  

export default function Manage(props){

    let params = useParams()
    const tournamentName = params.tournamentName
    const roundNumber = params.roundNumber
    let [pairs, setPairs] = useState('')
    let [scores, setScores] = useState([])
    let [endRound, setEndRound] = useState(false)
    const [lastRound, setLastRound] = useState('')
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const cookies = new Cookies();


    const useStyles = makeStyles({
        leftButton: {
            backgroundColor: 'white',
            border: '2px solid'
        },
        rightButton: {
          backgroundColor: 'black',
          color: 'white',
        },
        drawButton: {
            background: 'linear-gradient(45deg, white 30%, black 90%)',
            margin: 15
        }
    })

    const classes = useStyles()

    useEffect(() =>{
        if(!cookies.get("TOKEN")){
          navigate('/')
        }
    }, [])


    const getPairs = () => {
        axios.get('/manage/'+tournamentName+'/round/'+roundNumber)
        .then(res => {
            if(res.data.rounds[roundNumber-1] !== undefined) {
                let allPairs = res.data.rounds[roundNumber-1].pairs
                setPairs(allPairs);
                let roundOver = res.data.rounds[roundNumber-1].roundOver
                setEndRound(roundOver)
                let roundAmount = res.data.rounds.length
                setLastRound(roundAmount)
            }
            
        } )
        .catch(error => console.log(error))
      }

  const displayPairs = () => {
    if(pairs === undefined){
        return(<h1>No tournament found</h1>)
    }
    if(pairs.length>0){
        
        return(
            <Grid container spacing={1} align="center">
                
                <Grid item xs={12}>
                <h1>Round {roundNumber} of {lastRound}</h1>
                    <table>
                        <tbody>
                            {
                                pairs.map((pair, index) => {
                                    return(
                                    <tr key={index}>
                                        <td>{pair.pair[0].name}</td>
                                        {endRound ? 
                                        (<React.Fragment><td>{pair.score[0]}</td><td>{pair.score[1]}</td></React.Fragment>) : (<React.Fragment>
                                            <td>{<Button className={classes.leftButton} onClick={()=>{leftWin(index)}}>WIN</Button>}</td>
                                            <td>{<Button className={classes.drawButton} onClick={()=>{draw(index)}}>DRAW</Button>}</td>
                                            <td>{<Button className={classes.rightButton} onClick={()=>{rightWin(index)}}>WIN</Button>}</td>
                                            </React.Fragment>)
                                        }
                                        <td>{pair.pair[1].name}</td>
                                    </tr>
                                )})
                            }
                        </tbody>
                    </table>
                </Grid>
            </Grid> 
        )
    }else{
        return(<h1>No games found</h1>)
    }
  }
  

  function leftWin(index){
    scores[index] = [1,0]
  }
  function rightWin(index){
    scores[index] = [0,1]
  }
  function draw(index){
    scores[index] = [0.5,0.5]
  }

  function sendRoundInfo(decision){
      
    axios.post('/manage/'+tournamentName+'/round/'+roundNumber, {
        scores: scores,
        roundNumber: roundNumber,
        decision: decision
    }).then(lastRound != roundNumber ? navigate(`/manage/${tournamentName}/round/${parseInt(roundNumber)+1}`) : (navigate(`/tournament/${tournamentName}`), navigate(0)))
  }

  function displayDialog(){
      setOpenDialog(true)
  }


  useEffect(() =>{

    getPairs()

  }, [params])

  
    return (
        <div className="Home">
            {displayPairs()}
            {endRound & lastRound !== roundNumber ? 
            <Button variant="contained" onClick={()=> navigate(`/manage/${tournamentName}/round/${parseInt(roundNumber)+1}`)}>NEXT ROUND</Button> : 
            <Button color="secondary" variant="contained" disabled={endRound || !pairs} onClick={lastRound == roundNumber ? displayDialog : () => sendRoundInfo(false)}>END ROUND</Button>}
            <Grid container spacing={2}>
              <Grid item xs={12}>
        <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
              >
                <DialogTitle>                  
                  {"Do you want to save ranking points?"}
                  
                </DialogTitle>
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
    )
}