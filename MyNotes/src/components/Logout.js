import React from 'react';
import firebase from './Firebase/firebase'
import {Link, withRouter} from 'react-router-dom';

// Assistance:
// https://www.youtube.com/watch?v=unr4s3jd9qA
// This helped with getting the router to work with the component

const Logout = ({ history }) => {
    const signOut = event => {
        event.preventDefault();
        firebase.doSignOut();
        history.push("/login");
    }

    return(
        <div>
            <button onClick={signOut}>Sign Out</button>
        </div>
    )
}

export default withRouter(Logout);