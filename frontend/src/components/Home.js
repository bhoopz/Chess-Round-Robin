import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Grid, Typography, TextField, FormControl, FormControlLabel, Checkbox, MenuItem } from "@material-ui/core"
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";


function Home() {
  
  const [data, setData] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const cookies = new Cookies();

  useEffect(() =>{
    const fetchPlayers = async () => {
        const res = await axios.get(`/`);
        setData(res.data);
    }
    fetchPlayers();
    
  }, [])

  useEffect(() =>{
    axios.get('/login').then(response => {
      setToken(response.data.token)
      cookies.set("TOKEN", response.data.token)
    })
  }, [])




  axios.defaults.withCredentials = true

  function sendLoginData(){
    axios.post('/login',{
      username: username,
      password: password
    }).then(response => {
      if(response.data.token) navigate(0)
      setToken(response.data.token)
    }).catch(error => setError(error.response.data.error))
  }

  function logout(){
    axios.get('/logout').then(response => {
      setToken('');
      cookies.remove("TOKEN");
      navigate(0);
    })
  }


  return (
    <Grid container spacing={1}>
      {token ? <div>
        <Button onClick={logout} variant="contained">
          Log out
        </Button>
        <Button onClick={() => navigate('/create-tournament')} variant="contained">
          Create tournament
        </Button>
        <table>
        
            <tbody>
            <tr><th><h2>Manage</h2></th></tr>
            {data.map((item, index) => {
              for(var i = 0; i < item.rounds.length; i++){
                for(var j = 0; j < item.rounds.length; j++){
                  if(!item.rounds[j].roundOver){
                    return(
                      <tr key={index}>
                          <td><a href={`/manage/${item.name}/round/${parseInt(j+1)}`}>{item.name}</a></td>
                      </tr>)
                       }
                }
                
                  } 
                
            })}  
            </tbody>
        </table>  
        
    </div>
     : 
      <Grid item xs={12}  align="center">
        <FormControl>
            <TextField margin="normal"
                label="Username"
                variant="outlined"
                required={true}
                onChange={(e) => setUsername(e.target.value)}
                error={error.length > 0}
            />
            <TextField margin="normal"
                label="Password"
                variant="outlined"
                type='password'
                required={true}
                onChange={(e) => setPassword(e.target.value)}
                error={error.length > 0}
                helperText={error}
            />

            <Button onClick={sendLoginData} variant="contained">
              Log in
            </Button>
            
          </FormControl>
      </Grid>} 
      
      <Grid item xs={12}>
        
      <div className="Home">
        <table>
        
            <tbody>
            <tr><th>All tournaments</th></tr>
            {data.map((item, index) => {
                return(
                    <tr key={index}>
                        <td><a href={`/tournament/${item.name}`}>{item.name}</a></td>
                    </tr>
                )
            })}  
            </tbody>
        </table>  
    </div>
      </Grid>
    </Grid>

    
  );
}

export default Home;
