import React, { Component } from 'react';
import './App.css';
import ShowcaseToolbar from './toolbar/toolbar'
import ViewApps from './view-apps/view-apps';
import firebase from './firebase';
import {Button} from 'react-mdc-web';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  getContent() {
    if(!firebase.auth().currentUser) {
      return ( <div className="PreLoginContainer">
        <div className="LoginWelcomeText">
          Welcome to the DVT Showcase Admin app! Please sign in below.
        </div>
          <Button raised primary className="LoginButton" onClick={this.login.bind(this)}>Login</Button>
          {this.state.errorMessage &&
          <div className="ErrorMessageContainer">
              {this.state.errorMessage}
          </div>}
        </div>);

    } else {
      return (<ViewApps/>);
    }
  }
  
  login() {
    var scope = this;
    firebase.login().then(function(result) {
      scope.setState({
        currentUser: result
      });
    }).catch(function(error) {
      scope.setState({
        errorMessage: error.message
      })
    });
  }

  logout() {
    firebase.logout();
  }

  render() {
    return (
      <div>
        <ShowcaseToolbar/>
        {this.getContent()}
      </div>
    );
  }
}

export default App;