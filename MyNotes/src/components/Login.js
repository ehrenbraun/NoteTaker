import React from 'react';
import firebase from './Firebase/firebase';
import {Link, withRouter} from 'react-router-dom';

// Assistance:
// https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial
// This website helped with getting the firebase authentication with google

// https://www.youtube.com/watch?v=unr4s3jd9qA
// This helped with getting the router to work with the component


const Login = ({ history }) => {
  const signIn = event => {
    event.preventDefault();
    firebase.doSignInWithGoogle().then(function(result) {
      if(result.credential) {
        var email = firebase.auth.currentUser.email;
        var username = firebase.auth.currentUser.displayName;
        var userRef = firebase.firestore.collection("users").doc(email);
        userRef.get().then(function(doc) {
          if(!doc.exists){
            userRef.set({ name: username});
          }
        })
        history.push("/");
      }
    });
  }
  return(
    <div>
      <button onClick={signIn}>Sign In</button>
        
    </div>
  )
}

  export default withRouter(Login);