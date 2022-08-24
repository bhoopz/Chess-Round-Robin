import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { Button, Grid, Typography, TextField, FormControl, FormControlLabel, Checkbox, MenuItem } from "@material-ui/core"
import FormGroup from '@mui/material/FormGroup';
import Table from './Table'
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DatePicker from 'react-date-picker';
import Cookies from "universal-cookie";



export default function Create(props){

    const [type, setType] = useState('');   
    const [query, setQuery] = useState('');
    const [data, setData] = useState([]);
    const [arrayOfPlayers, setArrayOfPlayers] = useState([]);
    const [tournamentName, setTournamentName] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [federation, setFederation] = useState('');
    const [birthYear, setBirthYear] = useState(new Date('2000'));
    const [sex, setSex] = useState('Male');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const cookies = new Cookies();

    useEffect(() =>{
        const fetchPlayers = async () => {
            const res = await axios.get(`http://localhost:5000/create-tournament?q=${query}`);
            setData(res.data);
        }
        fetchPlayers();
    }, [query])

    useEffect(() =>{
        if(!cookies.get("TOKEN")){
          navigate('/')
        }
    }, [])

   
    function createTournament(){
        if(tournamentName.length < 8){
            setErrorMessage('Please enter at least 8 characters tournament name');
        }else if(/^\d+$/.test(tournamentName)){
            setErrorMessage('Incorrect tournament name');
        }else{
            axios.post('http://localhost:5000/create-tournament',{
                arrayOfPlayers: arrayOfPlayers,
                tournamentName: tournamentName,
                type: type,
            }).then((response) => {if(response.status === 200){
                navigate(`/manage/${response.data}/round/1`)
            }
            }).catch(() => {
                setErrorMessage('Tournament name already exists')
             })
        }
    }

    function addNewPlayer(){
        axios.post('http://localhost:5000/create-tournament/add',{
            name: name,
            lastName: lastName,
            federation: federation,
            birthYear: birthYear.getFullYear(),
            sex: sex,
        }).then((response) => setOpenDialog(false))
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
                    <TextField margin="normal"
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
                    <MenuItem value={'Blitz'}>Blitz</MenuItem>
                    <MenuItem value={'Rapid'}>Rapid</MenuItem>
                    <MenuItem value={'Standard'}>Standard</MenuItem>
                </TextField>

                <Button variant="contained" onClick={() => setOpenDialog(true)}>ADD PLAYER</Button>

                <TextField margin="normal"
                    label="Search..."
                    id="outlined-size-normal"
                    variant="outlined"
                    onChange={(e) => setQuery(e.target.value)}
                />
                
                </FormControl>
            </Grid>
            <Grid item xs={12}>
            {<Table data={data} setArrayOfPlayers={setArrayOfPlayers} />}
            <Button variant="contained" disabled={arrayOfPlayers.length < 4 || type.length === 0} onClick={createTournament}>CREATE TOURNAMENT</Button>
            </Grid>
            <Grid item xs={12}>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">                  
                  {"Add new player to database"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        id="name"
                        label="Name"
                        required={true}
                        fullWidth
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        id="last-name"
                        label="Last Name"
                        required={true}
                        fullWidth
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <TextField
                        id="federation"
                        label="Federation"
                        required={true}
                        fullWidth
                        onChange={(e) =>setFederation(e.target.value)}
                    />
                    <FormControlLabel control={<DatePicker maxDetail='decade' minDate={new Date('1920')} maxDate={new Date('2020')} onChange={setBirthYear} value={birthYear}/>} label=" Birth Year" />
                    <FormGroup row>
                        <FormControlLabel onChange={() => setSex('Male')} control={<Checkbox checked={sex=='Male'} color="primary"/>} label="Male" />
                        <FormControlLabel onChange={() => setSex('Female')} control={<Checkbox checked={sex=='Female'} color="primary"/>} label="Female" />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={addNewPlayer} variant="contained">
                        Add
                    </Button>
                    <Button onClick={() => setOpenDialog(false)} variant="contained">
                        Cancel
                    </Button>
                </DialogActions>
              </Dialog>
            </Grid>
        </Grid>
        
        
        
    )
}