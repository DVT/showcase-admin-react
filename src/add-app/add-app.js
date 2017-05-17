import React, { Component } from 'react';
import './add-app.css';
import * as firebase from "firebase";
import {Card, CardHeader, CardTitle, CardActions, Button,Textfield} from 'react-mdc-web';

class AddApp extends Component {

  constructor() {
    super();
    this.state = {
      name: "",
      description: "",
      functionality: "",
      client: "",
      technologies: "",
      industry: "",
      images: [],
      imagesAsData: [],
      enabled: false,
      key: ""
    }
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
  }

  login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  onDrop(event) {
    event.preventDefault();
    //TODO make this work for more than one image. Bad paul!
    var image = event.dataTransfer.files[0]; 
    if (image.type.startsWith("image")) {
        this.updateStateWithImage(image);
      } else {
        //TODO do something here
      }
  }

  updateStateWithImage(image){
    var scope = this;
    var reader = new FileReader();
    reader.onload = function(e) {
        console.log("Got image!" + reader.result);
        var images = scope.state.images;
        var imagesAsData = scope.state.imagesAsData;
        images.push(image);
        imagesAsData.push(reader.result);
        scope.setState({
          images: images,
          imagesAsData: imagesAsData
        });
    };

    reader.readAsDataURL(image);
  }

  preventDefault (event) {
    event.preventDefault();
  }

  getImagesAsHTMLFromState() {
    var currentImages = this.state.imagesAsData;
    var images = currentImages.map((image, index) => {
      return (
        <img src={image} key={index} className="image" alt=""/>
      );
    });

    return images;
  }

  saveButtonClicked(event) {
    var scope = this;
    var app = {
      name: this.state.name,
      shortDescription: this.state.description,
      functionality: this.state.functionality,
      client: this.state.client,
      technologyUsed: this.state.technologies,
      industry: this.state.industry,
      enabled: true
    };
    console.log(app);
    firebase.database().ref("apps/").push(app).then((result) => {
      scope.state.key = result.key;
      var imageQueue = scope.state.images;
      if(imageQueue.length > 0) {
        var imageReferenceList = [];
        scope.uploadImageForApp(scope.state.name, imageQueue, imageReferenceList);
      } else {
        alert("Upload complete!"); 
      }
    }).catch(function(error) {
      //TODO hide loader & show error message
      console.log("Firebase error occured: " + error);
      alert("Saving new app failed");
    });
  }

  uploadImageForApp(appName, imageQueue, imageReferenceList) {
    var scope = this;
    var image = imageQueue.shift();
    var imagePath = appName + "/" + image.name;

    firebase.storage().ref("app-images").child(imagePath).put(image).then(function(result){
      //TODO make a dynamic loading indicator with status report  
      imageReferenceList.push("app-images/" + imagePath); //Can probably make this prettier
      
      if(imageQueue.length > 0) {
        scope.uploadImageForApp(appName, imageQueue, imageReferenceList); //recursion awh yea
      } else {
        scope.updateAppImageReferences(imageReferenceList);
      }
    }).catch(function(error){
        //TODO inform user that all remaining images in imageQueue were not uploaded
        alert("Failed to upload image '" + image.name + "' with error " + error.message); 
    });
  }

  updateAppImageReferences(imageReferenceList) {
      
      if(this.state.key.length > 0) {
        var update = { };
        update["apps/" + this.state.key + "/imageReferences"] = imageReferenceList
        
        firebase.database().ref().update(update).then(function(result){
          alert("Upload complete!"); 
        }).catch(function(error){
          alert("Updating app image references failed..."); 
        });
      } else {
        alert("No app key found. Something went horribly, horribly wrong... "); 
      }   
  }
render() {
    return (
    <Card className="AddApp">
          <CardHeader>
            <CardTitle>
              Add new app
            </CardTitle>
          </CardHeader>
          <Textfield
          className="AddAppInput"
            floatingLabel="Name"
            value={this.state.name}
            onChange={(event) => {
              this.setState({name: event.target.value});
            }}/>
            <Textfield
            className="AddAppInput"
            floatingLabel="Short description"
            value={this.state.description}
            onChange={(event) => {
              this.setState({description: event.target.value});
            }}/>
            <Textfield
            className="AddAppInput"
            floatingLabel="Functionality"
            multiline
            value={this.state.functionality}
            onChange={(event) => {
              this.setState({functionality: event.target.value});
            }}/>
            <Textfield
            className="AddAppInput"
            floatingLabel="Client"
            value={this.state.client}
            onChange={(event) => {
              this.setState({client: event.target.value});
            }}/>
            <Textfield
            className="AddAppInput"
            floatingLabel="Technologies used"
            value={this.state.technologies}
            onChange={(event) => {
              this.setState({technologies: event.target.value});
            }}/>
            <Textfield
            className="AddAppInput"
            floatingLabel="Industry"
            value={this.state.industry}
            onChange={(event) => {
              this.setState({industry: event.target.value});
            }}/>
            <input
            className="AddAppInput"
            multiple
            type="file"
            onChange={(event) => {
              var listOfInvalidFiles = [];
              for (var i = 0; i < event.target.files.length; i++) {
                var file = event.target.files.item(i);
                if(file.type.startsWith("image")) {
                  this.updateStateWithImage(file);
                } else {
                  listOfInvalidFiles.push(file.name);
                }
              }
              if(listOfInvalidFiles.length > 0) {
                alert("The files '" + listOfInvalidFiles.toString() + "' are not valid image files");
              }
            }} />
            <div
            className="AddAppImageDrop"
            onDragOver={this.preventDefault} onDrop={(e) => {this.onDrop(e)}}>
              or drop your images here
            </div>
            {this.getImagesAsHTMLFromState()}
          <CardActions>
            <Button raised primary
            className="AddAppSaveButton"
            onClick={this.saveButtonClicked.bind(this)}
            >Save</Button>

            <Button raised primary
            className="AddAppSaveButton"
            onClick={this.login.bind(this)}
            >Login</Button>
          </CardActions>
        </Card>
    )
};
}

export default AddApp;
