import React from 'react';
import Login from "./components/Login";
import './App.css';
export const GoogleLogin = React.createContext();
function App() {

  return (
    <Login>
    <div className="App"></div>
    </Login>
  );
}

export default App;
