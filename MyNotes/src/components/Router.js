import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import firebase from './Firebase/firebase';
import Login from './Login';
import Logout from './Logout';

// Assistance:
// https://medium.com/@subalerts/creating-protected-routes-in-react-js-89e95974a822
// This helped with creating the router as a whole

// https://www.youtube.com/watch?v=unr4s3jd9qA
// This helped with the private route


const Router = () => (
    <Switch>
        <Route path='/login' component={Login}/>
        <PrivateRoute path="/" component={Logout} />
    </Switch>
)

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    return (
      <Route
        {...rest}
        render={routeProps =>
          !!firebase.auth.currentUser ? (
            <RouteComponent {...routeProps} />
          ) : (
            <Redirect to={"/login"} />
          )
        }
      />
    );
  };


export default Router;