import React from 'react';
import './App.css';
import MainChart from './components/MainChart';
import Sidebar from './components/Sidebar'; // MAKE SURE THIS IMPORT EXISTS

function App() {
  return (
    <div className="App">
      <div className="main-layout">
        <MainChart />
        <Sidebar /> {/* MAKE SURE THIS LINE EXISTS */}
      </div>
    </div>
  );
}

export default App;