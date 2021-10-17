import './App.css';
import React, {useState, useEffect} from 'react';
import abi from './contracts/Election.json';
import Web3 from "web3";
import Header from './Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import VoterPage from './Pages/VoterPage';
import Register from './Pages/Register';
import AddCandidatePage from './Pages/AddCandidatePage';

function App() {
  
  
  return (
    <Router>
      <div>
       <Switch>
          
          <Route path="/register">
            <Register/>
          </Route>
          <Route path="/candidate">
            <AddCandidatePage/>
          </Route>
          <Route path="/">
            <VoterPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}




export default App;
