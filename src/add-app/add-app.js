import React, { Component } from 'react';
import { withRouter } from 'react-router';
import './add-app.css';
import firebase from './../firebase';
import {Card, CardHeader, CardTitle, CardActions, Button, Textfield, FormField, Checkbox} from 'react-mdc-web';
import ShowcaseToolbar from '../toolbar/toolbar';

class AddApp extends Component {

  constructor(props) {
    super();
    if(props && props.location.state) {
      this.state = props.location.state;
      this.state.images = this.state.screenshots;
      this.state.technologies = this.state.technologyUsed;
      this.state.editMode = true;
      
      console.log("Found state: " + JSON.stringify(this.state));
    } else {
      this.state = {
        name: "",
        client: "",
        id: "",
        shortDescription: "",
        functionality: "",
        technologies: "",
        industry: "",
        androidPackageName: "",
        iosUrl: "",
        images: [],
        imagesAsData: [],
        enabled: true
      }  
    }
  }

  componentDidMount() {
    if(!firebase.auth().currentUser) {
      this.props.history.replace({pathname: '/'});
      return;
    }

    if(this.state.screenshots) {
      var images = [];
      this.state.screenshots.map((imageUrl, index) => {
        var self = this;
        firebase.storage().ref().child(imageUrl).getDownloadURL().then((url) => {
          images.push(url);
          self.setState({
            images: images
          });
        });
      }, this);
    }

    if(this.state.iconUrl) {
      var self = this;
      firebase.storage().ref().child(this.state.iconUrl).getDownloadURL().then((url) => {
        self.setState({
          icon: url
        });
      });
    }
  }

  login() {
    firebase.login();
  }

  onDrop(event) {
    event.preventDefault();
    //TODO make this work for more than one image. Bad paul!
    var atLeastOneInvalidImage = false;
    for(var i = 0; i < event.dataTransfer.files.length; i++) {
      var image = event.dataTransfer.files[i]; 
      if (image.type.startsWith("image")) {
        this.updateStateWithImage(image);
      } else {
        atLeastOneInvalidImage = true;
      }
    }

    if(atLeastOneInvalidImage) {
      alert("Some files were not uploaded because they aren't valid image files"); 
    }
  }

  onDropIcon(event) {
    event.preventDefault();
    var image = event.dataTransfer.files[0]; 
    if (image.type.startsWith("image")) {
        this.updateStateWithIcon(image);
      } else {
        alert("Please upload a valid image!"); 
      }
  }

  updateStateWithImage(image){
    var scope = this;
    var reader = new FileReader();
    reader.onload = function(e) {
        // console.log("Got image!" + reader.result);
        var images = scope.state.images || [];
        var imagesAsData = scope.state.imagesAsData || [];

        images.push(image);
        imagesAsData.push(reader.result);
        scope.setState({
          images: images,
          imagesAsData: imagesAsData
        });
    };

    reader.readAsDataURL(image);
  }

  updateStateWithIcon(image){
    var scope = this;
    var reader = new FileReader();
    reader.onload = function(e) {
        scope.setState({
          icon: image,
          iconAsData: reader.result
        });
    };

    reader.readAsDataURL(image);
  }

  preventDefault (event) {
    event.preventDefault();
  }

  getImagesAsHTMLFromState() {
    var currentImages = this.state.images || [];
    
    var images = currentImages.map((image, index) => {
      return (
        <img src={image} key={index} className="Image" alt=""/>
      );
    });

    console.log("Returning existing images: " + images.toString());
    return images;
  }

  getNewImagesAsHTMLFromState() {
    var currentImagesAsData = this.state.imagesAsData || [];
    
    var images = currentImagesAsData.map((image, index) => {
      return (
        <img src={image} key={index} className="Image" alt=""/>
      );
    });
    
    console.log("Returning new images: " + images.toString());
    return images;
  }

  showImages() {
    //TODO move these to seperate components
    if(this.state.editMode) {
      return (
        <div>
          <div className="NewImages">
            {this.getNewImagesAsHTMLFromState()}
        </div>
        <div className="ExistingImages">
          {this.getImagesAsHTMLFromState()}
        </div>
      </div>);
    } else {
      return (<div>
        <div className="NewImages">
            {this.getNewImagesAsHTMLFromState()}
        </div>
        </div>
      )
    }
  }

  showIcon() {
    var source;
    if(this.state.iconAsData) {
      source = this.state.iconAsData;
    } else if(this.state.icon) {
      source = this.state.icon;
    }

    return (
      <div>
        {source && 
            <img src={source} key="icon" className="Image" alt=""/>
        }
      </div>
    )
  }

  saveButtonClicked(event) {
    var scope = this;
    var app = {
      name: this.state.name,
      client: this.state.client,
      id: this.state.id,
      shortDescription: this.state.shortDescription,
      functionality: this.state.functionality,
      technologyUsed: this.state.technologies,
      industry: this.state.industry,
      enabled: this.state.enabled
    };

    if(this.state.androidPackageName && this.state.androidPackageName.length > 0) {
      app.androidPackageName = this.state.androidPackageName;
    }

    if(this.state.iosUrl && this.state.iosUrl.length > 0) {
      app.iosUrl = this.state.iosUrl;
    }

    console.log(app);
    this.setState({
      loading: true,
      message: "Uploading new app..."
    });

    firebase.database().ref("apps/" + app.name).set(app).then(() => {
      var imageQueue = scope.state.images;
      if(this.state.icon) {
        imageQueue.push(this.state.icon);
      }
      if(imageQueue && imageQueue.length > 0) {
        var imageReferenceList = [];
        scope.uploadImageForApp(app.name, imageQueue, imageReferenceList);
      } else {
        this.setState({
          loading: false,
          message: "Upload complete!"
        });

        alert("Upload complete!"); 
        this.props.history.replace({pathname: '/'});
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
    this.setState({
      message: "Uploading " + image.name
    });

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
      var update = {};
      update["apps/" + this.state.name + "/screenshots"] = imageReferenceList
      if(this.state.icon) {
        var imagePath = this.state.name + "/" + this.state.icon.name;
        update["apps/" + this.state.name + "/iconUrl"] = "app-images/" + imagePath;
      }
      this.setState({
        message: "Updating image references..."
      });
      var scope = this;
      firebase.database().ref().update(update).then(function(result){
        scope.setState({
          loading: false,
          message: "Upload complete!"
        });

        alert("Upload complete!"); 
        scope.props.history.replace({pathname: '/'});
      }).catch(function(error){
        alert("Updating app image references failed..."); 
        console.log("Uploading image references failed: " + error.message);
      });
  }

render() {
    return (
      <div >
        <ShowcaseToolbar/>
      <Card className="AddApp">
            <CardHeader>
              <CardTitle>
                Add new app
              </CardTitle>
            </CardHeader>
            {this.state.loading && 
              <div className="Loader"></div>
            }
            {this.state.message && 
              <div>{this.state.message}</div>
            }
          {!this.state.loading &&
          <div>
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
              value={this.state.iosUrl}
              onChange={(event) => {
                this.setState({iosUrl: event.target.value});
              }}/>
              <div className="AddAppInput">
            <FormField id="labeled-checkbox">
              <Checkbox 
                onChange={({target: {checked}})=>{
                  this.setState({enabled: checked})
                }}
                checked={this.state.enabled}
              />
              <label>Enabled?</label>
            </FormField>
            </div>
            Screenshots:
            {this.showImages()}
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
                or drop your screenshots here
              </div>
              Icon:
              {this.showIcon()}
              <input
              className="AddAppInput"
              type="file"
              onChange={(event) => {
                var listOfInvalidFiles = [];
                for (var i = 0; i < event.target.files.length; i++) {
                  var file = event.target.files.item(i);
                  if(file.type.startsWith("image")) {
                    this.updateStateWithIcon(file);
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
              onDragOver={this.preventDefault} onDrop={(e) => {this.onDropIcon(e)}}>
                  or drop your icon here
              </div>
            <CardActions>
              <Button raised primary
              className="AddAppSaveButton"
              onClick={this.saveButtonClicked.bind(this)}
              >Save</Button>
            </CardActions>

            </div>
            }
          </Card>
        </div>
    )
  };
}

export default withRouter(AddApp);
