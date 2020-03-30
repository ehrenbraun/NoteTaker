import React from 'react';
import NavBar from './NavBar';
import firebase from './Firebase/firebase';

/**
 * This component allows the user to view their typed notes.
 * They cannot edit the notes in this.
 * 
 * @param match -the value passed by the router (from one page to another)
 */
const TextViewer = ({match}) => {
    // state for the text
    const [text, updateText] = React.useState("");

    // if there is a async function, this needs to be here
    React.useEffect(() => {
        loadText();
        return function cleanup() {

        }
    }, []);

    /**
     * This method loads the text into the span object for the viewer to see
     */
    const loadText = async () => {
        const email = firebase.auth.currentUser.email;
        const docRef = firebase.firestore.collection("users").doc(email).collection("myNotes").doc(match.params.note);
        await docRef.get().then(doc => {
            updateText(doc.data().text);
        });
    }

    // html documents and my own component
    return(
        <div>
            <NavBar></NavBar>
            <span onLoad={loadText}>{text}</span>
        </div>
    )
}

export default TextViewer;