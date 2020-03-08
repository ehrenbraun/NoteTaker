import app from 'firebase/app';
import 'firebase/auth';

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
          this.db = app.firestore();
          this.googleProvider = new app.auth.GoogleAuthProvider();
      }
      doSignInWithGoogle = () =>
      this.auth.signInWithPopup(this.googleProvider);

      doSignOut = () => this.auth.signOut();
  }
  
  export default Firebase;