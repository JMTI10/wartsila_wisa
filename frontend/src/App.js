import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import MainChart from './components/MainChart';
import DataDisplay from './components/DataDisplay';
import Sidebar from './components/Sidebar';
import Engine from './components/Engine';

// Create a layout component that conditionally shows sidebar
function Layout({ children, showSidebar, selectedMetrics, onMetricsChange, onPlantSelect, currentPlant }) {
  return (
    <div className="main-layout">
      {showSidebar && (
        <Sidebar 
          onMetricsChange={onMetricsChange} 
          onPlantSelect={onPlantSelect}
        />
      )}
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
  const [currentPlant, setCurrentPlant] = useState(1);
  const [sidebarApiData, setSidebarApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch plant overview data (separate from sidebar engine data)
  useEffect(() => {
    const fetchPlantOverview = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:3001/api/operations/plants/${currentPlant}`);
                
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setPlantData(result.data || result);
      } catch (error) {
        console.error('Error fetching plant overview data:', error);
        setError(`Failed to fetch plant overview: ${error.message}`);
        setPlantData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantOverview();
  }, [currentPlant]);

  // Handle metrics change from sidebar (now receives both metrics and API data)
  const handleMetricsChange = (metrics, apiData = null) => {
    setSelectedMetrics(metrics);
    
    // Store the API data from sidebar for use in other components
    if (apiData) {
      setSidebarApiData(apiData);
    }
    
    // You can add additional logic here to process the combined data
    console.log('Selected metrics:', metrics);
    console.log('Sidebar API data:', apiData);
  };

  // Handle plant selection from sidebar
  const handlePlantSelect = (plantId) => {
    setCurrentPlant(plantId);
    
    // Clear previous data while new data loads
    setPlantData(null);
    setSidebarApiData(null);
    
    console.log('Plant selected:', plantId);
  };

  // Combine plant overview data and sidebar engine data for components
  const getCombinedPlantData = () => {
    return {
      overview: plantData,
      engines: sidebarApiData,
      currentPlant: currentPlant,
      loading: loading,
      error: error
    };
  };

  return (
    <div className="App">
      <Layout
        showSidebar={showSidebar}
        selectedMetrics={selectedMetrics}
        currentPlant={currentPlant}
        onMetricsChange={handleMetricsChange}
        onPlantSelect={handlePlantSelect}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="dashboard-container">
                {/* Show loading state */}
                {loading && (
                  <div className="dashboard-status loading">
                    <span>🔄</span> Loading plant data...
                  </div>
                )}
                
                {/* Show error state */}
                {error && (
                  <div className="dashboard-status error">
                    <span>❌</span> {error}
                  </div>
                )}
                
                {/* Main dashboard components */}
                <MainChart 
                  selectedMetrics={selectedMetrics}
                  plantData={getCombinedPlantData()}
                  currentPlant={currentPlant}
                />
                <DataDisplay 
                  plantData={getCombinedPlantData()}
                  selectedMetrics={selectedMetrics}
                  currentPlant={currentPlant}
                />
              </div>
            } 
          />
          <Route 
            path="/engine" 
            element={
              <Engine 
                currentPlant={currentPlant}
                plantData={getCombinedPlantData()}
              />
            } 
          />
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