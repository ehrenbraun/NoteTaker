import React from 'react';
import {withRouter, Link} from 'react-router-dom';
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
        <table align="center">
            <tbody>
                {noteTitles.map(noteTitle => (
                    <tr key={noteTitle}>
                        <td key={noteTitle + "1"}><h4 key={noteTitle + "title"}>{noteTitle}   </h4></td>
                        <td key={noteTitle + "2"}><Link to={`/viewNotes/${noteTitle}`}><button key={noteTitle + "view"}>View</button></Link></td>
                        <td key={noteTitle + "3"}><Link to={`/editNotes/${noteTitle}`}><button key={noteTitle + "edit"}>Edit</button></Link></td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    )
}

export default withRouter(NoteList);