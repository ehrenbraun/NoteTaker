import React from 'react';
import firebase from './Firebase/firebase';
import {withRouter, Link} from 'react-router-dom';


const Typing = (props) => {
    const inputRef = React.useRef(null);
    const inputRef2 = React.useRef(null);
    const [loaded, updateState] = React.useState(false);
    const [used, update] = React.useState(false);
    const [titles, updateTitles] = React.useState([]);

    const email = firebase.auth.currentUser.email;
    const userRef = firebase.firestore.collection("users").doc(email);
    const docRef = userRef.collection("myNotes").doc(props.docId);

    React.useEffect(() => {
        loadText();
        fetchTitles();
        return function cleanup() {

        }
    }, [])

    const fetchTitles = async () => {
        var noteTitles = []
        await userRef.collection("myNotes").get().then(snapshot => {
            snapshot.forEach(doc =>{
                noteTitles.push(doc.id);
            })
        })
        updateTitles(noteTitles);
    }
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
    return (
        <div>
            <span>Title: </span>
            <input ref={inputRef2} onChange={checkTitles}></input>
            <input ref={inputRef}></input>
            <Link to="/myNotes"><button onClick={saveData} disabled={used}>Save</button></Link>
        </div>
    )
}

export default withRouter(Typing);