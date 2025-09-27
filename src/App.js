import React from 'react';
import './App.css';
import MainChart from './components/MainChart';
import Sidebar from './components/Sidebar';
import DataDisplay from './components/DataDisplay';

function App() {
  return (
    <div className="App">
      <div className="main-layout">
        <MainChart />
        <Sidebar />
        <DataDisplay />
      </div>
    </div>
  );
}

export default App;