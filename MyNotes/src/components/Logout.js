import React from 'react';
import firebase from './Firebase/firebase'

const Logout = () => {
    const signOut = event => {
        event.preventDefault();
        console.log(firebase.auth.currentUser);
        firebase.doSignOut();
        console.log(firebase.auth.currentUser);
    }

    return(
        <div>
            <button onClick={signOut}>Sign Out</button>
        </div>
    )
}

export default Logout;