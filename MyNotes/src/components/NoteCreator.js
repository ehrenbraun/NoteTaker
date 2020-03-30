import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import firebase from './Firebase/firebase';
import NavBar from './NavBar'

/**
 * This component is where the user can create either
 * a written or typed set of notes and give a title
 * to the notes.
 */
const NoteCreator = () => {
    // reference to the select
    const selectRef = React.useRef(null);

    // These states tell which type of note is being 
    // created and if the title has been used before
    const [unique, update] = React.useState(false);

    const [option, updateOption] = React.useState("Typing");

    const [title, updateTitle] = React.useState("");
    
    const [titles, setTitles] = React.useState([]);

    // in order to use async functions, need this
    React.useEffect(() => {
        fetchNoteTitles();
        return () => {
            setTitles([]);
        }
    }, [])

    // document reference
    const email = firebase.auth.currentUser.email;
    const userNotes = firebase.firestore.collection("users").doc(email).collection("myNotes");

    /**
     * This method creates the note given the type selected
     * and the title given
     */
    const createNote = () => {
        var select = selectRef.current;
        if(select.selectedIndex === 0){
            userNotes.doc(title).set({type: "text", text: ""});
        } else{
            userNotes.doc(title).set({type: "write", written: []});
        }
        
    }

    /**
     * This method gets the note titles that the user has used
     */
    const fetchNoteTitles = async () => {
        var noteTitles = [];
        await userNotes.get().then(snapshot => {
            snapshot.forEach(doc => {
                noteTitles.push(doc.id);
            })
        })
        setTitles(noteTitles);
    }

    /**
     * This method checks if the title that has been typed has been
     * used.  If the title has been used or is an empty string, then
     * the create button is disabled.
     * 
     * @param event -the change in the input for the title
     */
    const checkTitle = event => {
        if(!titles.includes(event.target.value) && event.target.value != ""){
            update(true);
            updateTitle(event.target.value);
        } else{
            update(false);
        }
        
    }

    /**
     * This method changes the state of which type of note is selected
     */
    const changeOption = () => {
        const select = selectRef.current;
        updateOption(select.selectedIndex === 0 ? "Typing" : "Writing")
    }

    /**
     * This method routes the current page to the editor of the type
     * that was selected.
     */
    const determinePath = () => {
        return option === "Typing" ? `/editNotes/text/${title}` : `/editNotes/write/${title}`;
    }

    // This is the html with my own component
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