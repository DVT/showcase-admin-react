import firebase from 'firebase'
const firebaseConfig = {
  apiKey: "AIzaSyAbBd_l-lkCM-0BxpMjq_efjyVz9FMiz0c",
  authDomain: "showcase-qa.firebaseapp.com",
  databaseURL: "https://showcase-qa.firebaseio.com",
  projectId: "showcase-qa",
  storageBucket: "showcase-qa.appspot.com",
  messagingSenderId: "534352629086"
};

var fire = firebase.initializeApp(firebaseConfig);

fire.login = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

export default fire;