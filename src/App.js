import React, { Component } from 'react';
import './App.css';
import * as firebase from "firebase";
import {Card} from 'react-mdc-web';
import {CardText} from 'react-mdc-web';
import {CardHeader} from 'react-mdc-web';
import {TextField} from 'react-mdc-web';
import {Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle} from 'react-mdc-web';
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

  getAppsFromStateAsHtml() {
    var html = [];
    for(var i = 0; i < this.state.apps.length; i++) {
      var app = this.state.apps[i];
      var index = i;
      
        html.push(<Card key={i} className="AppCard">
        <CardHeader>
          {app.name}
        </CardHeader>
      </Card>);
    }

    return html;
  }

  addApp() {
    this.props.history.push('/add-app/');
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