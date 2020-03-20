import * as app from 'firebase';

//Assistance from:
// Minh Ta: Help with cleaning up code to function correctly throughout firebase implementation
// https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial => all files in Firebase folder

const firebaseConfig = {
    apiKey: "AIzaSyDmjLwU8lMd5Do3bqBJNoikiXtkpXlZ3DY",
    authDomain: "notetaker-efa68.firebaseapp.com",
    databaseURL: "https://notetaker-efa68.firebaseio.com",
    projectId: "notetaker-efa68",
    storageBucket: "notetaker-efa68.appspot.com",
    messagingSenderId: "702866379356",
    appId: "1:702866379356:web:371e4fbc8b4fc21ea68c99",
    measurementId: "G-CJWHH1YV76"
  };

  class Firebase {
      constructor() {
          app.initializeApp(firebaseConfig);
          this.auth = app.auth();
          this.firestore = app.firestore();
          this.googleProvider = new app.auth.GoogleAuthProvider();
      }
      doSignInWithGoogle = () =>
      this.auth.signInWithPopup(this.googleProvider);

      doSignOut = () => this.auth.signOut();
  }
  const firebase = new Firebase();
  export default firebase;