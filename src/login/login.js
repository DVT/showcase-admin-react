import React, { Component } from 'react';
import './login.css';
import firebase from './../firebase';
import {Card, CardHeader, CardTitle, CardActions, Button, Textfield, FormField, Checkbox} from 'react-mdc-web';

class Login extends Component {

  constructor() {
    super();
    
  }

   componentDidMount() {
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken;
        // var id_token = result.credential.idToken;
        console.log("Sign in successful! " + result);
        alert("Google authentication successful!");
      }

      // The signed-in user info.
      // var user = result.user;
    }).catch(function(error) {
      alert("Google authentication failed");
    });

    if(this.state.screenshots) {
      this.state.screenshots.map((imageUrl, index) => {
        var self = this;
        firebase.storage().ref().child(imageUrl).getDownloadURL().then((url) => {
          var images = self.state.images || [];
          images.push(url);
          self.setState({
            images: images
          });
        });
      }, this);
    }
  }

  login() {
    firebase.login();
  }

  render() {
    
    return (
      <Card className="loginContainer">
        <Button raised primary
              className="LoginButton"
              onClick={this.login.bind(this)}
              >LOGIN WITH GOOGLE</Button>
      </Card>
    );
  }
}

export default Login;