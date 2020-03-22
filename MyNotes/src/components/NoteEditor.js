import React from 'react';
import Writing from './Writing';
import NavBar from './NavBar';

// Assistance:

// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
// this helped with getting the canvas drawing started

const NoteEditor = ({match}) => {
    
    return (
        <div>
            <NavBar></NavBar>
            <Writing docId={match.params.note}></Writing>
        </div>
    )
}

export default NoteEditor;