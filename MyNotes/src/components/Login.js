import React from 'react';
import '../App.css';
import GoogleLogin from 'react-google-login';


export const Login = () => {
      const responseGoogle = (response) => {
        
      };
    return(
        <GoogleLogin
        clientId="303167274627-fiqmq21s120j5ngtck0trq35b39dcu3n.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
      />
    )
}

export default Login;