import React from 'react';


const FirebaseContext  = React.createContext(null);

// This creates a context of the firebase object so that other
// components will be able to access the firebase object

export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase}/>}
    </FirebaseContext.Consumer>
);

export default FirebaseContext;