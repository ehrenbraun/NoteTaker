import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import firebase from './Firebase/firebase';
import NavBar from './NavBar';

/**
 * This is the component that shows all the notes that the user
 * has giving the option to edit or view their notes
 */
const NoteList = () => {
    // this is needed for async functions
    React.useEffect(() => {
        fetchNoteTitles();
        return function cleanup(){
            setNoteTitles([]);
        }
    }, [])

    // This state is for the set of note titles to be displayed
    const [noteTitles, setNoteTitles] = React.useState([]);

    /**
     * This method fetches the note titles and allows for the
     * html to have the title displayed with buttons that direct
     * to the editing/viewing of that specific set of notes.
     */
    const fetchNoteTitles = async () => {
        var email = firebase.auth.currentUser.email;
        var userNotes = firebase.firestore.collection("users").doc(email).collection("myNotes");
        // to render collection of children, must use an array
        var userNoteTitles = [];
        await userNotes.get().then(snapshot => {
            snapshot.forEach(doc => {
                userNoteTitles.push({id: doc.id, type: doc.data().type});
            })
        })
        setNoteTitles(userNoteTitles);
    }
    
    /**
     * This is the html with my own component. The one thing to point out
     * is that the display of the titles with their buttons have their own
     * keys to be unique and that I map over the titles to get the specific
     * title
     */
    return(
        <div>
        <NavBar/>
        <h2>Note List</h2>
        <table align="center">
            <tbody>
                { noteTitles && noteTitles.map(noteTitle => (
                    <tr key={noteTitle.id}>
                        <td key={noteTitle.id + "1"}><h4 key={noteTitle.id + "title"}>{noteTitle.id}   </h4></td>
                        <td key={noteTitle.id + "2"}><Link to={`/viewNotes/${noteTitle.type}/${noteTitle.id}`}><button key={noteTitle.id + "view"}>View</button></Link></td>
                        <td key={noteTitle.id + "3"}><Link to={`/editNotes/${noteTitle.type}/${noteTitle.id}`}><button key={noteTitle.id + "edit"}>Edit</button></Link></td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    )
}

export default withRouter(NoteList);