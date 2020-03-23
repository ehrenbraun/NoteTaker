import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import firebase from './Firebase/firebase';
import Login from './Login';
import NavBar from './NavBar';
import NoteList from './NoteList';
import NoteCreator from './NoteCreator';
import TextEditor from './TextEditor';
import DrawingEditor from './DrawingEditor';

// Assistance:
// https://medium.com/@subalerts/creating-protected-routes-in-react-js-89e95974a822
// This helped with creating the router as a whole

// https://www.youtube.com/watch?v=unr4s3jd9qA
// This helped with the private route


const Router = () => (
    <Switch>
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/" component={NavBar} />
        <PrivateRoute path="/myNotes" component={NoteList} />
        <PrivateRoute path="/createNotes" component={NoteCreator}/>
        <PrivateRoute path="/viewNotes/:note" component={NoteList}/>
        <PrivateRoute path="/editNotes/text/:note" component={TextEditor}/>
        <PrivateRoute path="/editNotes/write/:note" component={DrawingEditor}/>
        <PrivateRoute path="/*" />
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