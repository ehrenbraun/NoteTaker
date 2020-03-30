import React from 'react';
import firebase from './Firebase/firebase';
import {withRouter, Link} from 'react-router-dom';

// Assistance:
// https://www.youtube.com/watch?v=unr4s3jd9qA
// This helped with getting the router to work with the logout component

/**
 * This component is the navigation bar at the top of the page. For the most
 * part, this component is always present.
 * 
 * @param history -the history of the url and what is being loaded now
 */
const NavBar = ({ history}) => {
    /**
     * This method signs out the user and routes them to the sign in
     * @param event -the sign out button being clicked 
     */
    const signOut = event => {
        event.preventDefault();
        firebase.doSignOut();
        history.push("/login");
    }

    // this is the html being used in the component
    return(
        <nav style={{background: 'gray', justifyContent: 'space-around', display: 'flex', minHeight: '10vh'}}>
            <h1>NoteTaker</h1>
            <h4><Link to="/myNotes">My Notes</Link></h4>
            <Link to="/createNotes"><h4>Create Notes</h4></Link>
            <Link to="/login"><button onClick={signOut}>Sign Out</button></Link>
        </nav>
    )
}

export default withRouter(NavBar);