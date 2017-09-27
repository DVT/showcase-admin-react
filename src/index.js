import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'material-components-web/dist/material-components-web.min.css';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import AddApp from './add-app/add-app'

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route exact path="/add-app" component={AddApp}/>
    </Switch>
  </Router>,
  document.getElementById('root')
);
