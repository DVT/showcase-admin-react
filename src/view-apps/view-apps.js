import React, { Component } from 'react';
import { withRouter } from 'react-router';
import './view-apps.css';
import firebase from '../firebase';
import {Card} from 'react-mdc-web';
import {CardText} from 'react-mdc-web';
import {CardHeader} from 'react-mdc-web';
import {TextField} from 'react-mdc-web';
import {Button, Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle, IconToggle} from 'react-mdc-web';
import {Fab} from 'react-mdc-web';
import {Icon} from 'react-mdc-web';

class ViewApps extends Component {

  constructor() {
    super();
    this.state = {
      apps: [],
      appToExpand: {},
      loading: true
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
        apps: apps,
        loading: false
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
    
    this.props.history.push({
      pathname: '/add-app/',
      state: app
    });
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
              <b>Functionality:</b> {app.functionality}<br/>
              <b>Technologies:</b> {app.technologyUsed}<br/>
              <b>Industry:</b> {app.industry}<br/>
              <b>Android Package Name:</b> {app.androidPackageName}<br/>
              <b>iOS URL:</b> {app.iosUrl}<br/>
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

  render() {
    return (
      <div>
        {this.state.loading && 
            <div className="Loader"></div>
        }
        <div className="Cards">
          {this.getAppsFromStateAsHtml()}
        </div>
        <div className="FABContainer">
          {!this.state.loading && 
            <Fab className="AddAppFAB" onClick={this.addApp.bind(this)}><Icon name='create'/></Fab>
          }
        </div>
      </div>
    );
  }
}

export default withRouter(ViewApps);