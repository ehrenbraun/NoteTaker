import React from 'react';
import NavBar from './NavBar';
import firebase from './Firebase/firebase';

/**
 * This component allows the user to see their written/drawn notes
 * 
 * @param match -the value passed by the router 
 */
const DrawingViewer = ({match}) => {

    // html reference for the canvas
    const canvasRef = React.useRef(null);

    // need to have when using async functions
    React.useEffect(() => {
        loadDrawing();
        return function cleanup () {

        }
    }, []);

    /**
     * This method loads the written/drawn notes from firestore by
     * getting a list of values that represent the pixels in the canvas
     * that need to be drawn in
     */
    const loadDrawing = async () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        var inputData = [];
        const email = firebase.auth.currentUser.email;
        const docRef = firebase.firestore.collection("users").doc(email).collection("myNotes").doc(match.params.note);
        await docRef.get().then(doc => {
            inputData = doc.data().written;
        })
        inputData.map(pixel => {
            data[pixel] = 255;
        })
        ctx.putImageData(imageData, 0, 0);
    }

    // html documents and own component
    return(
        <div>
            <NavBar/>
            <canvas ref={canvasRef} style={{border: '2px solid black'}} onLoad={loadDrawing}></canvas>
        </div>
    )
}

export default DrawingViewer;