import React from 'react';
import Login from "./components/Login";
import './App.css';
import GLogin from './components/GLogin';
//export const GoogleLogin = React.createContext();


function App() {
console.log('here');
  return (
    <GLogin>
    <div className="App"></div>
    </GLogin>
  );
}

export default App;
