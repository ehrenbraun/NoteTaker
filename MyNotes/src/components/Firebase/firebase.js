import * as app from 'firebase';

//Assistance from:
// Minh Ta: Help with cleaning up code to function correctly throughout firebase implementation
// https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial => all files in Firebase folder

const firebaseConfig = {
    
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