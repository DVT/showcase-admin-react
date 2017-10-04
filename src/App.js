import React, { Component } from 'react';
import './App.css';
import firebase from './firebase';
import {Card} from 'react-mdc-web';
import {CardText} from 'react-mdc-web';
import {CardHeader} from 'react-mdc-web';
import {TextField} from 'react-mdc-web';
import {Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle, IconToggle} from 'react-mdc-web';
import {Fab} from 'react-mdc-web';
import {Icon} from 'react-mdc-web';

class App extends Component {

  constructor() {
    super();
    this.state = {
      apps: [],
      appToExpand: {}
    }
  }

  componentDidMount() {  
    firebase.database().ref("apps/").once('value').then((result) => {
      var apps = [];
      var resultVal = result.val();
      for (var key in resultVal) {
        if (resultVal.hasOwnProperty(key)) {
          apps.push(resultVal[key]);
        }
      }

      this.setState({
        apps: apps
      });
    });
  }

  appClicked(i, event) {
    var app = this.state.apps[i];
    if(this.state.appToExpand == app) {
      this.setState({appToExpand: {}});
    } else {
      this.setState({appToExpand: app});
    }
  }

  editApp(i, event) {
    event.stopPropagation();
    var app = this.state.apps[i];
  }

  getAppsFromStateAsHtml() {
    var scope = this;
    var html = this.state.apps.map(function(app, i) {
      if(this.state.appToExpand == app) {
        return(
          <Card key={i} onClick={this.appClicked.bind(this, i)} className="AppCard">
            <CardHeader>
              {app.name}
              <IconToggle className="material-icons" onClick={this.editApp.bind(this, i)}>
                edit
              </IconToggle>
            </CardHeader>
            <CardText>
              <b>Client:</b> {app.client}<br/>
              <b>ID:</b> {app.id}<br/>
              <b>Short Description:</b> {app.shortDescription}<br/>
              <b>Long Description:</b> {app.longDescription}<br/>
              <b>Functionality:</b> {app.functionality}<br/>
              <b>Technologies:</b> {app.technologyUsed}<br/>
              <b>Android Package Name:</b> {app.androidPackageName}<br/>
              <b>iOS URL:</b> {app.iosUrl}<br/>
              <b>Functionality:</b> {app.functionality}<br/>
            </CardText>
          </Card>);
      } else {
        return(
          <Card key={i} onClick={this.appClicked.bind(this, i)} className="AppCard">
            <CardHeader>
              <div>
              <span>{app.name}</span>
              </div>
            </CardHeader>
          </Card>);
      }
    }, this);

    return html;
  }

  addApp() {
    this.props.history.push('/add-app/');
  }

  editApp(index) {
    this.props.history.push({
      pathname: '/add-app/',
      state: {

      }
    });
  }

  render() {
    return (
      <div className="App">
        <Toolbar>
          <ToolbarRow>
            <ToolbarSection align="start">
              <ToolbarTitle>DVT Showcase Admin</ToolbarTitle>
            </ToolbarSection>
          </ToolbarRow>
        </Toolbar>
        {this.getAppsFromStateAsHtml()}
        <Fab className="addAppFab" onClick={this.addApp.bind(this)}><Icon name='create'/></Fab>
      </div>
    );
  }
}

export default App;