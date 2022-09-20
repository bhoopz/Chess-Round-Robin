import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DatePicker from "react-date-picker";
import { createPlayer } from "../services/PlayerService";
import {
  Button,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import FormGroup from "@mui/material/FormGroup";

export default function AddPlayer(props) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [federation, setFederation] = useState("");
  const [birthYear, setBirthYear] = useState(new Date("2000"));
  const [sex, setSex] = useState("Male");

  async function addNewPlayer() {
    try {
      const res = createPlayer({
        name: name,
        lastName: lastName,
        federation: federation,
        birthYear: birthYear.getFullYear(),
        sex: sex,
      });
      if (res.status === 200) {
        props.setOpenDialog(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Grid item xs={12}>
      <Dialog
        open={props.openDialog}
        onClose={() => props.setOpenDialog(false)}
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
            onChange={(e) => setFederation(e.target.value)}
          />
          <FormControlLabel
            control={
              <DatePicker
                maxDetail="decade"
                minDate={new Date("1920")}
                maxDate={new Date("2020")}
                onChange={setBirthYear}
                value={birthYear}
              />
            }
            label=" Birth Year"
          />
          <FormGroup row>
            <FormControlLabel
              onChange={() => setSex("Male")}
              control={<Checkbox checked={sex == "Male"} color="primary" />}
              label="Male"
            />
            <FormControlLabel
              onChange={() => setSex("Female")}
              control={<Checkbox checked={sex == "Female"} color="primary" />}
              label="Female"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={addNewPlayer} variant="contained">
            Add
          </Button>
          <Button
            onClick={() => props.setOpenDialog(false)}
            variant="contained"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
