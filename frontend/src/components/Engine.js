import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Engine.css';

const Engine = () => {
  const [engineData, setEngineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentEngineId, setCurrentEngineId] = useState(1); // Default to engine 1

  // Available engines
  const availableEngines = [1, 2, 3];

  useEffect(() => {
    const fetchEngineData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:3001/api/operations/engines/overview/${currentEngineId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setEngineData(data.data);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching engine data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEngineData();
  }, [currentEngineId]); // Re-fetch when engineId changes

  const handleEngineChange = (engineId) => {
    setCurrentEngineId(engineId);
  };

  if (loading) {
    return (
      <div className="engine-page">
        <div className="main-chart-header">
          <div className="header-left">
            <div className="header-brand">
              <h1>Wartsila</h1>
              <h2>Wisa Analytics</h2>
            </div>
            <p className="header-subtitle">Engine Monitoring & Performance</p>
          </div>
          <div className="header-right">
            <Link to="/" className="engine-link">
              <span className="engine-icon">←</span>
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading engine {currentEngineId} data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="engine-page">
        <div className="main-chart-header">
          <div className="header-left">
            <div className="header-brand">
              <h1>Wartsila</h1>
              <h2>Wisa Analytics</h2>
            </div>
            <p className="header-subtitle">Engine Monitoring & Performance</p>
            <div className="engine-selector">
              <span className="selector-label">Engine:</span>
              {availableEngines.map(engineId => (
                <button
                  key={engineId}
                  className={`engine-btn ${currentEngineId === engineId ? 'active' : ''}`}
                  onClick={() => handleEngineChange(engineId)}
                >
                  Engine {engineId}
                </button>
              ))}
            </div>
          </div>
          <div className="header-right">
            <Link to="/" className="engine-link">
              <span className="engine-icon">←</span>
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
        <div className="error-container">
          <h3>Error loading engine data</h3>
          <p>{error}</p>
          <button onClick={() => handleEngineChange(currentEngineId)} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!engineData) {
    return (
      <div className="engine-page">
        <div className="main-chart-header">
          <div className="header-left">
            <div className="header-brand">
              <h1>Wartsila</h1>
              <h2>Wisa Analytics</h2>
            </div>
            <p className="header-subtitle">Engine Monitoring & Performance</p>
            <div className="engine-selector">
              <span className="selector-label">Engine:</span>
              {availableEngines.map(engineId => (
                <button
                  key={engineId}
                  className={`engine-btn ${currentEngineId === engineId ? 'active' : ''}`}
                  onClick={() => handleEngineChange(engineId)}
                >
                  Engine {engineId}
                </button>
              ))}
            </div>
          </div>
          <div className="header-right">
            <Link to="/" className="engine-link">
              <span className="engine-icon">←</span>
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
        <div className="error-container">
          <h3>No data available</h3>
          <p>Unable to load engine information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="engine-page">
      {/* Header with Engine Selector */}
      <div className="main-chart-header">
        <div className="header-left">
          <div className="header-brand">
            <h1>Wartsila</h1>
            <h2>Wisa Analytics</h2>
          </div>
          <p className="header-subtitle">
            Engine Monitoring & Performance - {engineData.general_info.model}
          </p>
          <div className="engine-selector">
            <span className="selector-label">Select Engine:</span>
            {availableEngines.map(engineId => (
              <button
                key={engineId}
                className={`engine-btn ${currentEngineId === engineId ? 'active' : ''}`}
                onClick={() => handleEngineChange(engineId)}
              >
                Engine {engineId}
              </button>
            ))}
          </div>
        </div>
        
        <div className="header-right">
          <Link to="/" className="engine-link">
            <span className="engine-icon">←</span>
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Main Container with 4 Divs */}
      <div className="engine-main-container">
        
        {/* 1. Name ID */}
        <div className="engine-section name-id-section">
          <h2>General Information</h2>
          <div className="section-content">
            <div className="data-item">
              <label>Engine ID:</label>
              <span className="value">{engineData.general_info.engine_id}</span>
            </div>
            <div className="data-item">
              <label>Plant ID:</label>
              <span className="value">{engineData.general_info.plant_id}</span>
            </div>
            <div className="data-item">
              <label>Model:</label>
              <span className="value">{engineData.general_info.model}</span>
            </div>
            <div className="data-item">
              <label>Capacity:</label>
              <span className="value">{engineData.general_info.nameplate_capacity} MW</span>
            </div>
            <div className="data-item">
              <label>Status:</label>
              <span className={`value status-${engineData.general_info.status}`}>
                {engineData.general_info.status}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Efficiency */}
        <div className="engine-section efficiency-section">
          <h2>Efficiency Metrics</h2>
          <div className="section-content">
            <div className="data-item">
              <label>Heat Rate:</label>
              <span className="value">
                {engineData.efficiency_metrics.heat_rate} {engineData.efficiency_metrics.heat_rate_unit}
              </span>
            </div>
            <div className="data-item">
              <label>Thermal Efficiency:</label>
              <span className="value">
                {engineData.efficiency_metrics.thermal_efficiency} {engineData.efficiency_metrics.thermal_efficiency_unit}
              </span>
            </div>
            <div className="data-item">
              <label>Capacity Factor:</label>
              <span className="value">
                {engineData.efficiency_metrics.average_capacity_factor}%
              </span>
            </div>
            <div className="data-item">
              <label>Operating Hours:</label>
              <span className="value">
                {engineData.efficiency_metrics.total_operating_hours.toLocaleString()} hours
              </span>
            </div>
            <div className="data-item">
              <label>Total Generation:</label>
              <span className="value">
                {engineData.efficiency_metrics.total_net_generation.toLocaleString()} {engineData.efficiency_metrics.total_net_generation_unit}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Emissions Intensity */}
        <div className="engine-section cost-carbon-section">
          <h2>Emissions Intensity</h2>
          <div className="section-content">
            <div className="data-item">
              <label>CO2 Intensity:</label>
              <span className="value">
                {engineData.emissions_metrics.co2_intensity} {engineData.emissions_metrics.co2_intensity_unit}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Emission Rates */}
        <div className="engine-section emissions-section">
          <h2>Emission Rates</h2>
          <div className="section-content">
            <div className="data-item">
              <label>CO2 Rate:</label>
              <span className="value">
                {engineData.emissions_metrics.emission_rates.co2_rate.toLocaleString()} {engineData.emissions_metrics.emission_rates.co2_rate_unit}
              </span>
            </div>
            <div className="data-item">
              <label>NOx Rate:</label>
              <span className="value">
                {engineData.emissions_metrics.emission_rates.nox_rate} {engineData.emissions_metrics.emission_rates.nox_rate_unit}
              </span>
            </div>
            <div className="data-item">
              <label>SOx Rate:</label>
              <span className="value">
                {engineData.emissions_metrics.emission_rates.sox_rate} {engineData.emissions_metrics.emission_rates.sox_rate_unit}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Engine;