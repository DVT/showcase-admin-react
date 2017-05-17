import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as firebase from "firebase";
import 'material-components-web/dist/material-components-web.min.css';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import AddApp from './add-app/add-app'

const firebaseConfig = {
  apiKey: "AIzaSyDRpZkISgvHK7MQ-sjIdEzhKufnNcJKF8U",
  authDomain: "dvt-showcase-1b447.firebaseapp.com",
  databaseURL: "https://dvt-showcase-1b447.firebaseio.com",
  projectId: "dvt-showcase-1b447",
  storageBucket: "dvt-showcase-1b447.appspot.com",
  messagingSenderId: "491015639132"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route exact path="/add-app" component={AddApp}/>
    </Switch>
  </Router>,
  document.getElementById('root')
);
