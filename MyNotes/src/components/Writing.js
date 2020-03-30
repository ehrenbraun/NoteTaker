import React from 'react';
import firebase from './Firebase/firebase';
import {withRouter,Link} from 'react-router-dom'; 

// Assistance:

// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
// this helped with getting the canvas drawing started

/**
 * This component is the writing/drawing portion of the webpage. This is
 * where the writing type of notes can be created and edited. The user can
 * undo, erase, save, and delete the set of notes.
 * 
 * @param {*} props -the properties passed into the component (in this case,
 * the property that is being passed/used is the document id) 
 */
const Writing = (props) => {
    // These are references to the html documents so that we can manipulate
    // them.  I am going to point this out that it may look like repeating
    // myself when every method has: const canvas = canvasRef.current; followed
    // by the context each time, but I could not just do this outside the methods.
    // There would be an error and the only thing that I can think of is that an
    // action has to have occurred in order to get the reference.
    const canvasRef = React.useRef(null);
    const inputRef = React.useRef(null);

    // These are the states for making sure if the user changes the title that
    // it has not been used already by a different set of notes
    const [usedTitle, updateTitleStatus] = React.useState(false);
    const [titles, updateTitles] = React.useState([]);

    // This state is for loading an existing image
    const [oldImage, initializeImage] = React.useState(null);

    // These states are for drawing and having an undo and erase
    const [mouseDown, updateMouse] = React.useState(false);
    const [mouseLocation, updateLocation] = React.useState({x: 0, y: 0});
    const [trace, updateTrace] = React.useState([]);
    const [traces, updateTraces] = React.useState([]);
    const [traceStates, updateTraceStates] = React.useState([]);
    const [drawState, updateDrawState] = React.useState(true);
    
    // This is needed for a function that is async
    React.useEffect(() => {
        loadWritten();
        return function cleanup() {

        }
    }, [])
    
    // This is for having the reference for the document
    const email = firebase.auth.currentUser.email;
    const userRef = firebase.firestore.collection("users").doc(email);
    const docRef = userRef.collection("myNotes").doc(props.docId);
    
    /**
     * This method is the action of doing an undo. What really happens
     * is the last trace, as well as the last drawing state, are removed
     * and then the canvas is redrawn
     */
    const undoTrace = () => {
        if(traces.length > -1){
            let updatedTraceStates = traceStates.slice();
            updatedTraceStates.pop();
            updateTraceStates(updatedTraceStates);
            let updatedTraces = traces.slice();
            updatedTraces.pop();
            updateTraces(updatedTraces);
            redraw(updatedTraces);
        }
    }

    /**
     * This method loads the notes from firestore.  It receives which
     * pixles in the imageData object are supposed to be drawn. It also
     * gets what titles have been used already so that there is no repeat
     * of the same title of a set of notes.
     */
    const loadWritten = async () => {
        const canvas = canvasRef.current;
        const input = inputRef.current;
        input.value = props.docId;
        const ctx = canvas.getContext('2d');
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // loading pixels
        await docRef.get().then(doc => {
            let pixels = doc.data().written;
            pixels.map(pixel => {
                data[pixel] = 255;
            })
        })
        // loading titles that user has used
        var noteTitles = [];
        await userRef.collection("myNotes").get().then(snapshot => {
            snapshot.forEach(doc => {
                noteTitles.push(doc.id);
            })
        })
        updateTitles(noteTitles);
        ctx.putImageData(imageData, 0, 0);
        initializeImage(imageData);
    }

    /**
     * This method verifies whether the title that the user
     * has for the set of notes that they are editing has been
     * used already. If it is used or an empty string, then 
     * the save button is disabled
     */
    const checkTitles = () => {
        const input = inputRef.current;
        var used = false;
        for(let title = 0; title < titles.length; title++){
            if(input.value === titles[title]){
                if(input.value !== props.docId){
                    used = true;
                    break;
                }
            } else if(input.value === ""){
                used = true;
                break;
            }
        }
        updateTitleStatus(used);
    }

    /**
     * This method happens when the mouse has been pressed down
     * or has been lifted up/exited the canvas. If there was trace
     * and the mouse is up or has exited the canvas, then a new trace
     * is started and the old trace is added to the set of traces. 
     * 
     * @param {*} event -the mouse either being changed to down or up 
     * and the mouse exiting the canvas.
     */
    const updateMouseState = event => {
        var source = event.nativeEvent.type;
        if(source == "mousedown"){
            updateMouse(true);
        } else {
            updateMouse(false);
            if(trace.length != 0){
                let updatedTraceStates = traceStates.slice();
                updatedTraceStates.push(drawState);
                updateTraceStates(updatedTraceStates);
                let updatedTraces = traces.slice();
                updatedTraces.push(trace);
                updateTraces(updatedTraces);
                updateTrace([]);
            }
        }
    }

    /**
     * This method is to change the drawing state from drawing to erase
     * or the other way around.
     */
    const updateDrawingState = () => {
        updateDrawState(!drawState);
    }
    
    /**
     * This method is where the actual drawing/erasing occurs. If the mouse
     * is down, then it will draw or erase based off of the drawing state.
     * The drawing is a line from the previous position of the mouse to where
     * the mouse event occurred.
     * 
     * @param {*} event -the mouse being pressed down 
     */
    const draw = event => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if(mouseDown){
            var updatedTrace = trace.slice();
            updatedTrace.push(mouseLocation);
            updateTrace(updatedTrace);
            drawLine(ctx, drawState ? "black" : "white", drawState ? 2 : 7, mouseLocation.x, mouseLocation.y, event.clientX - rect.left, event.clientY - rect.top);
            
        }
        updateLocation({x: event.clientX - rect.left, y: event.clientY - rect.top});
    }
    
    /**
     * This method redraws the traces (both erase and draw) that have been made. 
     * This is used for when undo has occurred.
     * 
     * @param {*} updatedTraces -the changed set of traces
     */
    const redraw = (updatedTraces) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0 - rect.left, 0 - rect.top, canvas.width * 2, canvas.height * 2);
        ctx.putImageData(oldImage, 0, 0);
        for(let numTraces = 0; numTraces < updatedTraces.length; numTraces++){
            let currentTrace = traces[numTraces];
            let currentDrawingState = traceStates[numTraces];
            for(let numPoints = 0; numPoints < currentTrace.length - 1; numPoints++){
                let point1 = currentTrace[numPoints];
                let point2 = currentTrace[numPoints + 1];
                drawLine(ctx, currentDrawingState ? "black" : "white", currentDrawingState ? 2 : 7, point1.x, point1.y, point2.x, point2.y);
            }
        }
        
    }

    /**
     * This method is the actual drawing of on the canvas where it is
     * given the object, context of the canvas, to draw, the color, and
     * from one point to another.
     * 
     * @param {*} context -the object from the canvas that allows drawing/erasing
     * @param {*} color -the color that will be drawn
     * @param {*} width -the width of the line drawn
     * @param {*} x1 -the x value of the starting point
     * @param {*} y1 -the y vaule of the starting point
     * @param {*} x2 -the x value of the end point
     * @param {*} y2 -the y value of the end point
     */
    const drawLine = (context, color, width, x1, y1, x2, y2) => {
            context.beginPath();
            context.strokeStyle = color;
            context.lineWidth = width;
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
            context.closePath();
    }

    /**
     * This method saves the data to firestore where it looks at rgba values 
     * throughout the pixels of the canvas and if the alpha value is not transparent
     * and the the presence of green is 0 (in this case black is the lack of color, 
     * and the only color being used is black and white), then it stores the value
     * associated with the pixel in the canvas.  If the title was changed, then the
     * old document that had the id for the old title will be deleted and a new document
     * with the new title is created with the data. If the title was not changed, then 
     * the data is updated for the document.
     */
    const saveData = () => {
        var usedPixels = []
        const input = inputRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for(let pixel = 3; pixel < imageData.length; pixel += 4){
            let currentColor = imageData[pixel - 1];
            let currentAlpha = imageData[pixel];
            if(currentAlpha !== 0 && currentColor === 0){
                usedPixels.push(pixel)
            }
        }
        if(input.value === props.docId){
            docRef.update({written: usedPixels});
        } else{
            docRef.delete();
            userRef.collection("myNotes").doc(input.value).set({type: "write", written: usedPixels});
        }
    }

    /**
     * This method deletes the notes
     */
    const deleteNote = () => {
        docRef.delete();
    }

    /**
     * This is the html that the component loads
     */
    return (
        <div>
            <div>
                <span>Title: </span>
                <input ref={inputRef} onChange={checkTitles}></input>
            </div>
            <canvas style={{border: '2px solid black'}} ref={canvasRef} 
                onMouseMove={draw}
                onMouseLeave={updateMouseState}
                onMouseDown={updateMouseState} 
                onMouseUp={updateMouseState}>
            </canvas>
            <div>
                <button onClick={updateDrawingState}>{drawState ? "Erase" : "Draw"}</button>
                <button onClick={undoTrace}>Undo</button>
                <Link to="/myNotes"><button onClick={deleteNote}>Delete</button></Link>
                <Link to="/myNotes"><button onClick={saveData} disabled={usedTitle}>Save</button></Link>
            </div>
        </div>
    )
}

export default withRouter(Writing);