import React from 'react';
import './App.css';
import GLogin from './components/GLogin';
import firebase from './components/Firebase/firebase'
//export const GoogleLogin = React.createContext();


function App() {
  return (
    <div className="App">
      <GLogin/>
    </div>
   
  );
}

export default App;
