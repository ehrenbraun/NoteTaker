import React from 'react';
import firebase from './Firebase/firebase';

// Assistance:
// https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial

const Login = () => {
  const signIn = event => {
    event.preventDefault();
    firebase.doSignInWithGoogle();
    if(firebase.auth != null) {
      var email = firebase.auth.currentUser.email;
      var username = firebase.auth.currentUser.displayName;
      var userRef = firebase.firestore.collection("users").doc(email);
      userRef.get().then(function(doc) {
        if(!doc.exists){
          userRef.set({ name: username});
        }
      })
    }
  }
  return(
    <div>
        <button onClick={signIn}>Sign In</button>
    </div>
  )
}

  export default Login;