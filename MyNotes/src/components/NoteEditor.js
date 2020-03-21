import React from 'react';
import NavBar from './NavBar';

// Assistance:

// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
// this helped with getting the canvas drawing started

const NoteEditor = ({match}) => {
    const canvasRef = React.useRef(null);
    const [mouseDown, updateMouse] = React.useState(false);
    const [mouseLocation, updateLocation] = React.useState({x: 0, y: 0});
    const [trace, updateTrace] = React.useState([]);
    const [traces, updateTraces] = React.useState([]);
    
    const updateMouseState = event => {
        var source = event.nativeEvent.type;
        if(source == "mousedown"){
            updateMouse(true);
        } else {
            updateMouse(false);
            if(trace.length != 0){
                var updatedTraces = traces.slice();
                updatedTraces.push(trace);
                updateTraces(updatedTraces);
                updateTrace([]);
            }
        }
    }

    const drawLine = (context, rect, x1, y1, x2, y2) => {
            context.beginPath();
            context.strokeStyle = 'black';
            context.lineWidth = 1;
            context.moveTo(x1, y1);
            context.lineTo(x2 - rect.left, y2 - rect.top);
            context.stroke();
            context.closePath();
    }
    const draw = event => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if(mouseDown){
            var updatedTrace = trace.slice();
            updatedTrace.push(mouseLocation);
            updateTrace(updatedTrace);
            drawLine(ctx, rect, mouseLocation.x, mouseLocation.y, event.clientX, event.clientY);
            
        }
        updateLocation({x: event.clientX - rect.left, y: event.clientY - rect.top});
    }
    return (
        <div>
            <NavBar></NavBar>
            <canvas ref={canvasRef} 
                onMouseMove={draw}
                onMouseLeave={updateMouseState}
                onMouseDown={updateMouseState} 
                onMouseUp={updateMouseState}>
            </canvas>
        </div>
    )
}

export default NoteEditor;