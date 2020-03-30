import React from 'react';
import Typing from './Typing';
import NavBar from './NavBar';

// Assistance:

// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
// this helped with getting the canvas drawing started

/**
 * This component is the editor for typing/text
 * 
 * @param match -the value passed by the router
 */
const TextEditor = ({match}) => {
    return (
        <div>
            <NavBar></NavBar>
            <Typing docId={match.params.note}/>
        </div>
    )
}

export default TextEditor;