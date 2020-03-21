import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import firebase from './Firebase/firebase';
import NavBar from './NavBar'

const NoteCreator = ({ history }) => {
    const [unique, update] = React.useState(false);

    const [title, updateTitle] = React.useState("");
    
    const [titles, setTitles] = React.useState([]);
    React.useEffect(() => {
        fetchNoteTitles();
        return () => {
            setTitles([]);
        }
    }, [])

    const email = firebase.auth.currentUser.email;
    const userNotes = firebase.firestore.collection("users").doc(email).collection("myNotes");

    const createNote = () => {
        userNotes.doc(title).set({text: "", written: []})
    }

    const fetchNoteTitles = async () => {
        var noteTitles = [];
        await userNotes.get().then(snapshot => {
            snapshot.forEach(doc => {
                noteTitles.push(doc.id);
            })
        })
        setTitles(noteTitles);
    }

    const checkTitle = event => {
        if(!titles.includes(event.target.value) && event.target.value != ""){
            update(true);
            updateTitle(event.target.value);
        } else{
            update(false);
        }
        
    }
    return (
        <div>
            <NavBar/>
            <form onSubmit={createNote}>
                <span>Title: </span>
                <input onChange={checkTitle}></input>
                <Link to="/createNotes"><button disabled={!unique} onClick={createNote}>Create</button></Link>
            </form>
            <h4>{!!unique ? "" : "This title cannot used (you may have been used already)"}</h4>
        </div>
    )
}

export default withRouter(NoteCreator);