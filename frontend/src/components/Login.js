import React, { useState } from "react";
import { Button, Grid, TextField, FormControl } from "@material-ui/core";
import { login } from "../services/UserService";

const Login = (props) => {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function sendLoginData() {
    try {
      const res = await login({
        username: username,
        password: password,
      });
      props.setIsLogged(res.data.isLogged);
      localStorage.setItem("ISLOGGED", res.data.isLogged);
      localStorage.setItem("TOKEN", res.data.accessToken);
    } catch (err) {
      setError(err.response.data.message);
    }
  }
  return (
    <Grid item xs={12} align="center">
      <FormControl>
        <TextField
          margin="normal"
          label="Username"
          variant="outlined"
          required={true}
          onChange={(e) => setUsername(e.target.value)}
          error={error.length > 0}
        />
        <TextField
          margin="normal"
          label="Password"
          variant="outlined"
          type="password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
          error={error.length > 0}
          helperText={error}
        />

        <Button onClick={sendLoginData} variant="contained">
          Log in
        </Button>
      </FormControl>
    </Grid>
  );
};

export default Login;
