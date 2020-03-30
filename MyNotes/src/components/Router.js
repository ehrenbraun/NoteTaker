import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import firebase from './Firebase/firebase';
import Login from './Login';
import NavBar from './NavBar';
import NoteList from './NoteList';
import NoteCreator from './NoteCreator';
import TextEditor from './TextEditor';
import DrawingEditor from './DrawingEditor';
import TextViewer from './TextViewer';
import DrawingViewer from './DrawingViewer'

// Assistance:
// https://medium.com/@subalerts/creating-protected-routes-in-react-js-89e95974a822
// This helped with creating the router as a whole

// https://www.youtube.com/watch?v=unr4s3jd9qA
// This helped with the private route

/**
 * This component (or better yet object) is where the different webpages(components) 
 * are loaded based off of the url. If it is a private route, then the user needs to 
 * be signed in to use that page.  This is a switch statement, so it will go down
 * the options until it matches a path.
 */
const Router = () => (
    <Switch>
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/" component={NavBar} />
        <PrivateRoute path="/myNotes" component={NoteList} />
        <PrivateRoute path="/createNotes" component={NoteCreator}/>
        <PrivateRoute path="/viewNotes/text/:note" component={TextViewer}/>
        <PrivateRoute path="/viewNotes/write/:note" component={DrawingViewer}/>
        <PrivateRoute path="/editNotes/text/:note" component={TextEditor}/>
        <PrivateRoute path="/editNotes/write/:note" component={DrawingEditor}/>
        <PrivateRoute path="/*" />
    </Switch>
)

/**
 * This object is for creating a private route.  If the user is not signed
 * in and tries to go to a route that is private, then they get redirected
 * to the login page/component.
 * @param {*} param0 -the component that is trying to be loaded
 */
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