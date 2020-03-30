import React from 'react';
import firebase from './Firebase/firebase';
import {withRouter, Link} from 'react-router-dom';

/**
 * This component is the typing/text portion of the webpage. This is
 * where the typing type of notes can be created and edited. The user can
 * change the title, save, and delete the set of notes.
 * 
 * @param {*} props -the properties passed into the component (in this case,
 * the property that is being passed/used is the document id) 
 */
const Typing = (props) => {
    // These are the references for the html documents
    // See Writing.js for explaination of use
    const inputRef = React.useRef(null);
    const inputRef2 = React.useRef(null);

    // These are the states of the component that loads the notes
    // and also the titles that the user has used.
    const [loaded, updateState] = React.useState(false);
    const [used, update] = React.useState(false);
    const [titles, updateTitles] = React.useState([]);

    // This is for getting the document reference
    const email = firebase.auth.currentUser.email;
    const userRef = firebase.firestore.collection("users").doc(email);
    const docRef = userRef.collection("myNotes").doc(props.docId);

    // This is for functions that are async 
    React.useEffect(() => {
        loadText();
        fetchTitles();
        return function cleanup() {
            updateState(false);
        }
    }, [])

    /**
     * This method gets the titles that the user has used
     */
    const fetchTitles = async () => {
        var noteTitles = []
        await userRef.collection("myNotes").get().then(snapshot => {
            snapshot.forEach(doc =>{
                noteTitles.push(doc.id);
            })
        })
        updateTitles(noteTitles);
    }

    /**
     * This method checks to see if the title that user
     * has put in has been used.  If it has been used or
     * is an empty string, the save button is disabled.
     */
    const checkTitles = () => {
        const input2 = inputRef2.current;
        var used = false;
        for(let title = 0; title < titles.length; title++){
            if(input2.value === titles[title]){
                if(input2.value !== props.docId){
                    used = true;
                    break;
                }
            } else if(input2.value === ""){
                used = true;
                break;
            }
        }
        update(used);
    }

    /**
     * This method loads the text that was in the document.
     * Once it has been loaded, it will not try reloading the text
     * that was saved
     */
    const loadText = async () => {
        if(!loaded){
            const input = inputRef.current;
            await docRef.get().then(doc => {
                input.value = doc.data().text;
            })
            inputRef2.current.value = props.docId;
        }
        updateState(true);
    }

    /**
     * This method saves the text that has been typed to
     * firestore. If the title has been changed, the old
     * document is deleted and a new document is created with
     * the id given and the text is stored in there. If the
     * title was changed, then it updates the text.
     */
    const saveData = () => {
        const input = inputRef.current;
        const input2 = inputRef2.current;
        if(input2.value === props.docId){
            docRef.update({text: input.value});
        } else{
            docRef.delete();
            userRef.collection("myNotes").doc(input2.value).set({type: "text", text: input.value})
        }
    }

    /**
     * This method deletes the document
     */
    const deleteNote = () => {
        docRef.delete();
    }

    /**
     * This is the html that the component has/loads
     */
    return (
        <div>
            <div>
                <span>Title: </span>
                <input ref={inputRef2} onChange={checkTitles}></input>
            </div>
            <div>
                <textarea ref={inputRef} style={{width: "50%"}}></textarea>
            </div>
            <div>
                <Link to="/myNotes"><button onClick={deleteNote}>Delete</button></Link>
                <Link to="/myNotes"><button onClick={saveData} disabled={used}>Save</button></Link>
            </div>
        </div>
    )
}

export default withRouter(Typing);