import React from "react";
import "./App.css";
import { AuthContextProvider } from "./Context/AuthContext";
import { Routes } from "./Routes/Routes";

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <Routes />
      </AuthContextProvider>
    </div>
  );
}

export default App;
