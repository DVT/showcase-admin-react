import React, { Component } from 'react';
import './add-app.css';
import firebase from './../firebase';
import {Card, CardHeader, CardTitle, CardActions, Button, Textfield, FormField, Checkbox} from 'react-mdc-web';
import {Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle} from 'react-mdc-web';

class AddApp extends Component {

  constructor() {
    super();
    this.state = {
      name: "",
      client: "",
      id: "",
      shortDescription: "",
      longDescription: "",
      functionality: "",
      technologies: "",
      industry: "",
      androidPackageName: "",
      iOSURL: "",
      images: [],
      imagesAsData: [],
      enabled: true,
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
      client: this.state.client,
      id: this.state.id,
      shortDescription: this.state.shortDescription,
      longDescription: this.state.longDescription,
      functionality: this.state.functionality,
      technologyUsed: this.state.technologies,
      industry: this.state.industry,
      shortDescription: this.state.shortDescription,
      longDescription: this.state.longDescription,
      androidPackageName: this.state.androidPackageName,
      iOSURL: this.state.iOSURL,
      enabled: true
    };
    console.log(app);
    firebase.database().ref("apps/").push(app).then((result) => {
      scope.state.key = result.key;
      var imageQueue = scope.state.images;
      if(imageQueue.length > 0) {
        var imageReferenceList = [];
        scope.uploadImageForApp(scope.state.id, imageQueue, imageReferenceList);
      } else {
        alert("Upload complete!"); 
      }
    }).catch(function(error) {
      //TODO hide loader & show error message
      console.log("Firebase error occured: " + error);
      alert("Saving new app failed");
    });
  }

  uploadImageForApp(folderName, imageQueue, imageReferenceList) {
    var scope = this;
    var image = imageQueue.shift();
    var imagePath = folderName + "/" + image.name;

    firebase.storage().ref("app-images").child(imagePath).put(image).then(function(result){
      //TODO make a dynamic loading indicator with status report  
      imageReferenceList.push("app-images/" + imagePath); //Can probably make this prettier
      
      if(imageQueue.length > 0) {
        scope.uploadImageForApp(folderName, imageQueue, imageReferenceList); //recursion awh yea
      } else {
        scope.updateAppImageReferences(imageReferenceList);
      }
    }).catch(function(error){
        if(imageQueue.length == 1) {
          alert("Failed to upload image '" + image.name + "' with error " + error.message); 
        } else {
          alert("Failed to upload image '" + image.name + "' with error " + error.message + ". " + imageQueue.length - 1 + " other images not uploaded."); 
        }
    });
  }

  updateAppImageReferences(imageReferenceList) {
      if(this.state.key.length > 0) {
        var update = { };
        update["apps/" + this.state.key + "/screenshots"] = imageReferenceList
        
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
      <div >
        <Toolbar>
          <ToolbarRow>
            <ToolbarSection align="start">
              <ToolbarTitle>DVT Showcase Admin</ToolbarTitle>
            </ToolbarSection>
          </ToolbarRow>
        </Toolbar>
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
              floatingLabel="Client"
              value={this.state.client}
              onChange={(event) => {
                this.setState({client: event.target.value});
              }}/>
            <Textfield
              className="AddAppInput"
              floatingLabel="ID (image folder name based on this)"
              value={this.state.id}
              onChange={(event) => {
                this.setState({id: event.target.value});
              }}/>
            <Textfield
              className="AddAppInput"
              floatingLabel="Short description"
              value={this.state.shortDescription}
              onChange={(event) => {
                this.setState({shortDescription: event.target.value});
              }}/>
            <Textfield
              className="AddAppInput"
              floatingLabel="Long description"
              value={this.state.longDescription}
              onChange={(event) => {
                this.setState({longDescription: event.target.value});
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
            <Textfield
              className="AddAppInput"
              floatingLabel="Android Package Name"
              value={this.state.androidPackageName}
              onChange={(event) => {
                this.setState({androidPackageName: event.target.value});
              }}/>
            <Textfield
              className="AddAppInput"
              floatingLabel="iOS URL"
              value={this.state.iOSURL}
              onChange={(event) => {
                this.setState({iOSURL: event.target.value});
              }}/>
            <FormField id="labeled-checkbox">
              <Checkbox 
                onChange={({target: {checked}})=>{
                  this.setState({enabled: checked})
                }}
                checked={this.state.enabled}
              />
              <label>Enabled?</label>
            </FormField>
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
        </div>
    )
  };
}

export default AddApp;
