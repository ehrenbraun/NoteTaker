import React, { Component } from 'react';
import {withFirebase} from './Firebase/context';
import GoogleLogin from 'react-google-login';
import {compose} from 'recompose';

class SignInGoogleBase extends Component {
    constructor(props) {
      super(props);
      this.state = { error: null };
    }
  
    onSubmit = event => {
      this.props.firebase
        .doSignInWithGoogle()
        .then(socialAuthUser => {
          this.props.firebase
            .user(socialAuthUser.user.uid)
            .set({
              username: socialAuthUser.user.displayName,
              email: socialAuthUser.user.email,
              roles: [],
            })
            .then(() => {
              this.setState({ error: null });
              //this.props.history.push(ROUTES.HOME);
              console.log('logged in!');
            })
            .catch(error => {
              this.setState({ error });
            });
        })
        .catch(error => {
          this.setState({ error });
        });
  
      event.preventDefault();
    };

    render() {
      const { error } = this.state;
      return (
      <form onSubmit={this.onSubmit}>
        <button type="submit">Sign In</button>

        {error && <p>{error.message}</p>}
      </form>
      );
    }
  }

  const SignInGoogle = compose(withFirebase, (SignInGoogleBase));

  export default GoogleLogin;

  export {SignInGoogle};