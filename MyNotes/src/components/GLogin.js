import React, { Component } from 'react';
import firebase from './Firebase/firebase';

class SignInGoogleBase extends Component {
    constructor(props) {
      super(props);
      this.state = { error: null};
    }   
    
    onSubmit = event => {
  
      event.preventDefault();
      firebase.doSignInWithGoogle();
      if(firebase.auth != null) {
        var email = firebase.auth.currentUser.email;
        var userRef = firebase.firestore.collection("users").doc(email);
        userRef.get().then(function(doc) {
          if (!doc.exists){
            userRef.set({
              name: firebase.auth.currentUser.displayName
            });
          }         
        })
      }
    };

    render() {
      const { error } = this.state;
      return (
      <div>
        <form onSubmit={this.onSubmit}>
          <button type="submit">Sign In</button>
          {error && <p>{error.message}</p>}
        </form>
      </div>
      );
    }
  }

  export default SignInGoogleBase;