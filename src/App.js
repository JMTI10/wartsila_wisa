import React from 'react';
import './App.css';
import MainChart from './components/MainChart';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="App">
      <div className="main-layout">
        <MainChart />
        <Sidebar />
      </div>
    </div>
  );
}

export default App;