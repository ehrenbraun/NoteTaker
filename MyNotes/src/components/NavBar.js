import React from 'react';
import firebase from './Firebase/firebase';
import {withRouter, Link} from 'react-router-dom';

// Assistance:
// https://www.youtube.com/watch?v=unr4s3jd9qA
// This helped with getting the router to work with the logout component

const NavBar = ({ history}) => {
    const signOut = event => {
        event.preventDefault();
        firebase.doSignOut();
        history.push("/login");
    }

    return(
        <nav style={{background: 'gray', justifyContent: 'space-around', display: 'flex', minHeight: '10vh'}}>
            <h1>NoteTaker</h1>
            <h4><Link to={"/session/myNotes"}>My Notes</Link></h4>
            <Link to={`/session/createNotes`}><h4>Create Notes</h4></Link>
            <button onClick={signOut}>Sign Out</button>
        </nav>
    )
}

export default withRouter(NavBar);