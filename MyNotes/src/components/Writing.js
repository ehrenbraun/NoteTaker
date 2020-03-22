import React from 'react';
import firebase from './Firebase/firebase';

// Assistance:

// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
// this helped with getting the canvas drawing started

const Writing = (props) => {
    const canvasRef = React.useRef(null);
    const [oldImage, initializeImage] = React.useState(null);
    const [mouseDown, updateMouse] = React.useState(false);
    const [mouseLocation, updateLocation] = React.useState({x: 0, y: 0});
    const [trace, updateTrace] = React.useState([]);
    const [traces, updateTraces] = React.useState([]);
    const [traceStates, updateTraceStates] = React.useState([]);
    const [drawState, updateDrawState] = React.useState(true);
    
    React.useEffect(() => {
        loadWritten();
        return function cleanup() {

        }
    }, [])
    
    const email = firebase.auth.currentUser.email;
    const userRef = firebase.firestore.collection("users").doc(email);
    const docRef = userRef.collection("myNotes").doc(props.docId);
    
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
    const loadWritten = async () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        await docRef.get().then(doc => {
            let pixels = doc.data().written;
            pixels.map(pixel => {
                data[pixel] = 255;
            })
        })
        ctx.putImageData(imageData, 0, 0);
        initializeImage(imageData);
    }
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

    const updateDrawingState = () => {
        updateDrawState(!drawState);
    }
    
    const draw = event => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if(mouseDown){
            var updatedTrace = trace.slice();
            updatedTrace.push(mouseLocation);
            updateTrace(updatedTrace);
            drawLine(ctx, drawState ? "black" : "white", mouseLocation.x, mouseLocation.y, event.clientX - rect.left, event.clientY - rect.top);
            
        }
        updateLocation({x: event.clientX - rect.left, y: event.clientY - rect.top});
    }
    
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
                drawLine(ctx, currentDrawingState ? "black" : "white", point1.x, point1.y, point2.x, point2.y);
            }
        }
        
    }

    const drawLine = (context, color, x1, y1, x2, y2) => {
            context.beginPath();
            context.strokeStyle = color;
            context.lineWidth = drawState ? 2 : 7;
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
            context.closePath();
    }

    const saveData = () => {
        var usedPixels = []
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
        docRef.update({written: usedPixels});
    }
    return (
        <div>
            <canvas style={{border: '2px solid black'}} ref={canvasRef} 
                onMouseMove={draw}
                onMouseLeave={updateMouseState}
                onMouseDown={updateMouseState} 
                onMouseUp={updateMouseState}>
            </canvas>
            <button onClick={updateDrawingState}>{drawState ? "Erase" : "Draw"}</button>
            <button onClick={undoTrace}>Undo</button>
            <button onClick={saveData}>Save</button>
        </div>
    )
}

export default Writing;