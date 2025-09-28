import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import MainChart from './components/MainChart';
import DataDisplay from './components/DataDisplay';
import Sidebar from './components/Sidebar';
import Engine from './components/Engine';

// Create a layout component that conditionally shows sidebar
function Layout({ children, showSidebar, selectedMetrics, onMetricsChange }) {
  return (
    <div className="main-layout">
      {showSidebar && <Sidebar onMetricsChange={onMetricsChange} />}
      <div className={`main-content ${showSidebar ? 'with-sidebar' : 'full-width'}`}>
        {children}
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const showSidebar = location.pathname !== '/engine';
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [plantData, setPlantData] = useState(null);

  // Fetch plant data
  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/operations/plants/overview/1/info');
        const result = await response.json();
        setPlantData(result.data || result);
      } catch (error) {
        console.error('Error fetching plant data:', error);
      }
    };

    fetchPlantData();
  }, []);

  const handleMetricsChange = (metrics) => {
    setSelectedMetrics(metrics);
  };

  return (
    <div className="App">
      <Layout 
        showSidebar={showSidebar} 
        selectedMetrics={selectedMetrics}
        onMetricsChange={handleMetricsChange}
      >
        <Routes>
          <Route path="/" element={
            <div className="dashboard-container">
              <MainChart selectedMetrics={selectedMetrics} />
              <DataDisplay plantData={plantData} selectedMetrics={selectedMetrics} />
            </div>
          } />
          <Route path="/engine" element={<Engine />} />
        </Routes>
      </Layout>
    </div>
  );
}

// Wrap App with Router
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}