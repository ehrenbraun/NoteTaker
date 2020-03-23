import React from 'react';
import firebase from './Firebase/firebase';
import Writing from './Writing';
import Typing from './Typing';
import NavBar from './NavBar';

// Assistance:

// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
// this helped with getting the canvas drawing started

const NoteEditor = ({match}) => {
    const docRef = firebase.firestore.collection("users").doc(firebase.auth.currentUser.email).collection("myNotes").doc(match.params.note);
    const [textBased, inform] = React.useState(true);
    docRef.get().then(doc => {
        inform(doc.data().type === "text");
    })
    return (
        <div>
            <NavBar></NavBar>
            {textBased ? <Typing docId={match.params.note}/> : <Writing docId={match.params.note}/>}
        </div>
    )
}

export default NoteEditor;