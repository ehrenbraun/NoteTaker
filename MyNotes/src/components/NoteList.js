import React from 'react';
import {withRouter} from 'react-router-dom';
import firebase from './Firebase/firebase';
import NavBar from './NavBar';

const NoteList = () => {
    React.useEffect(() => {
        fetchNoteTitles();
    }, [])

    const [noteTitles, setNoteTitles] = React.useState([]);
    const fetchNoteTitles = async () => {
        var email = firebase.auth.currentUser.email;
        var userNotes = firebase.firestore.collection("users").doc(email).collection("myNotes");
        // to render collection of children, must use an array
        var userNoteTitles = [];
        await userNotes.get().then(snapshot => {
            snapshot.forEach(doc => {
                userNoteTitles.push(doc.id);
            })
        })
        setNoteTitles(userNoteTitles);
    }
    
    
    return(
        <div>
        <NavBar/>
        <h2>Note List</h2>
        {noteTitles.map(noteTitle => (
            <h4 key={noteTitle}>{noteTitle}</h4>
        ))}
        </div>
    )
}

export default withRouter(NoteList);