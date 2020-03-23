import React from 'react';
import NavBar from './NavBar';
import firebase from './Firebase/firebase';

const DrawingViewer = ({match}) => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        loadDrawing();
        return function cleanup () {

        }
    }, []);
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
    return(
        <div>
            <NavBar/>
            <canvas ref={canvasRef} style={{border: '2px solid black'}} onLoad={loadDrawing}></canvas>
        </div>
    )
}

export default DrawingViewer;