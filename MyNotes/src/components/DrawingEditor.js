import React from 'react';
import Writing from './Writing';
import NavBar from './NavBar';

// Assistance:

// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
// this helped with getting the canvas drawing started

/**
 * This component is the editor for written/drawn notes
 * 
 * @param match -the value passed by the router
 */
const DrawingEditor = ({match}) => {
    // html and components
    return (
        <div>
            <NavBar></NavBar>
            <Writing docId={match.params.note}/>
        </div>
    )
}

export default DrawingEditor;