import './App.css';
import React from 'react'
import Home from './components/Home'
import Manage from './components/Manage'
import Create from './components/Create'
import Info from './components/Info'
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";

function App() {

  return (
    <div className="App">
   <Router>
    <Routes>

      <Route path="/manage/:tournamentName/round/:roundNumber" element={<Manage />}></Route>
      <Route path="/create-tournament" element={<Create />}></Route>
      <Route path="/tournament/:tournamentName" element={<Info />}></Route>
      <Route exact path="/" element={<Home />}></Route>

    </Routes>
   </Router>
  </div>
  );
}

export default App;