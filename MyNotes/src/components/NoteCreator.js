import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import firebase from './Firebase/firebase';
import NavBar from './NavBar'

const NoteCreator = ({ history }) => {
    const selectRef = React.useRef(null);
    const [unique, update] = React.useState(false);

    const [option, updateOption] = React.useState("Typing");

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
        var select = selectRef.current;
        if(select.selectedIndex === 0){
            userNotes.doc(title).set({type: "text", text: ""});
        } else{
            userNotes.doc(title).set({type: "write", written: []});
        }
        
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

    const changeOption = () => {
        const select = selectRef.current;
        updateOption(select.selectedIndex === 0 ? "Typing" : "Writing")
    }
    const determinePath = () => {
        return option === "Typing" ? `/editNotes/text/${title}` : `/editNotes/write/${title}`;
    }
    return (
        <div>
            <NavBar/>
            <form onSubmit={createNote}>
                <span>Title: </span>
                <input onChange={checkTitle}></input>
                <Link to={determinePath}><button disabled={!unique} onClick={createNote}>Create</button></Link>
            </form>
            <select ref={selectRef} onChange={changeOption}>
                <option>Typing</option>
                <option>Writing</option>
            </select>
            <h4>{!!unique ? "" : "This title cannot be used (you may have used this already)"}</h4>
        </div>
    )
}

export default withRouter(NoteCreator);