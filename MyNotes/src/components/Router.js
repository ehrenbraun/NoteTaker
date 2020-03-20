import React from 'react';
import { Route, Redirect, BrowserRouter } from 'react-router-dom';
import firebase from './Firebase/firebase';
import Login from './Login';
import NavBar from './NavBar';
import NoteList from './NoteList';

// Assistance:
// https://medium.com/@subalerts/creating-protected-routes-in-react-js-89e95974a822
// This helped with creating the router as a whole

// https://www.youtube.com/watch?v=unr4s3jd9qA
// This helped with the private route


const Router = () => (
    <BrowserRouter>
        <Route path="/" component={Login} />
        <Route path="/session" component={NavBar} />
        <Route path={"/session/myNotes"} component={NoteList} />
    </BrowserRouter>
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