import React from 'react';
import firebase from './Firebase/firebase';
import Writing from './Writing';
import Typing from './Typing';
import NavBar from './NavBar';

// Assistance:

// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
// this helped with getting the canvas drawing started

const NoteEditor = ({match}) => {
    return (
        <div>
            <NavBar></NavBar>
            <Typing docId={match.params.note}/>
        </div>
    )
}

export default NoteEditor;