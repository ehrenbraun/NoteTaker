import React from 'react';
import NavBar from './NavBar';
import firebase from './Firebase/firebase';

const TextViewer = ({match}) => {
    const [text, updateText] = React.useState("");

    React.useEffect(() => {
        loadText();
        return function cleanup() {

        }
    }, []);
    const loadText = async () => {
        const email = firebase.auth.currentUser.email;
        const docRef = firebase.firestore.collection("users").doc(email).collection("myNotes").doc(match.params.note);
        await docRef.get().then(doc => {
            updateText(doc.data().text);
        });
    }
    return(
        <div>
            <NavBar></NavBar>
            <span onLoad={loadText}>{text}</span>
        </div>
    )
}

export default TextViewer;