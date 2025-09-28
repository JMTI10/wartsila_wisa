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

  // Prepare chart data from daily measurements
  const prepareChartData = () => {
    if (!engineData || !engineData.emissions_daily_data) return null;
    
    const dailyData = engineData.emissions_daily_data.slice(0, 7); // Show 7 days
    
    return {
      labels: dailyData.map(item => new Date(item.date).toLocaleDateString()),
      co2Emissions: dailyData.map(item => item.co2_emissions),
      netGeneration: dailyData.map(item => item.net_generation),
      co2Intensity: dailyData.map(item => item.co2_intensity)
    };
  };

  const chartData = prepareChartData();

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

      {/* NEW CHARTS SECTION ADDED HERE */}
      {chartData && (
        <div className="charts-section">
          <h3 className="charts-title">Daily Performance Metrics</h3>
          <div className="charts-container">
            {/* Chart 1: CO2 Emissions vs Net Generation */}
            <div className="chart-card">
              <h4>CO2 Emissions & Net Generation</h4>
              <div className="chart-wrapper">
                <div className="simple-bar-chart">
                  <div className="chart-bars-container">
                    {chartData.labels.map((label, index) => {
                      // Calculate heights based on actual values with proper scaling
                      const maxCo2 = Math.max(...chartData.co2Emissions);
                      const maxGeneration = Math.max(...chartData.netGeneration);
                      const co2Height = (chartData.co2Emissions[index] / maxCo2) * 85;
                      const generationHeight = (chartData.netGeneration[index] / maxGeneration) * 85;
                      
                      return (
                        <div key={index} className="chart-bar-group">
                          <div className="chart-bars-wrapper">
                            <div 
                              className="chart-bar co2-bar" 
                              style={{ height: `${co2Height}%` }}
                              title={`${label}: CO2 - ${chartData.co2Emissions[index].toLocaleString()} kg`}
                            >
                              <span className="bar-value">
                                {chartData.co2Emissions[index] > 1000000 
                                  ? `${(chartData.co2Emissions[index] / 1000000).toFixed(1)}M`
                                  : chartData.co2Emissions[index] > 1000 
                                    ? `${(chartData.co2Emissions[index] / 1000).toFixed(0)}K`
                                    : Math.round(chartData.co2Emissions[index])
                                }
                              </span>
                            </div>
                            <div 
                              className="chart-bar generation-bar" 
                              style={{ height: `${generationHeight}%` }}
                              title={`${label}: Generation - ${chartData.netGeneration[index]} MWh`}
                            >
                              <span className="bar-value">{Math.round(chartData.netGeneration[index])}</span>
                            </div>
                          </div>
                          <div className="chart-label">
                            {new Date(label.split('/').reverse().join('-')).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color co2-color"></span>
                  <span>CO2 Emissions</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color generation-color"></span>
                  <span>Net Generation (MWh)</span>
                </div>
              </div>
            </div>

            {/* Chart 2: CO2 Intensity */}
            <div className="chart-card">
              <h4>CO2 Intensity Trend (kg/MWh)</h4>
              <div className="chart-wrapper">
                <div className="co2-intensity-bars">
                  <div className="intensity-bars-container">
                    {chartData.co2Intensity.map((value, index) => {
                      const maxIntensity = Math.max(...chartData.co2Intensity);
                      const minIntensity = Math.min(...chartData.co2Intensity);
                      const intensityHeight = 15 + ((value - minIntensity) / (maxIntensity - minIntensity)) * 70;
                      
                      return (
                        <div key={index} className="intensity-bar-group">
                          <div 
                            className="intensity-bar" 
                            style={{ height: `${intensityHeight}%` }}
                            title={`${chartData.labels[index]}: ${value} kg/MWh`}
                          >
                            <span className="intensity-value">{Math.round(value)}</span>
                          </div>
                          <div className="intensity-label">
                            {new Date(chartData.labels[index].split('/').reverse().join('-')).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="chart-stats">
                <div className="stat-item">
                  <span>Min: </span>
                  <strong>{Math.min(...chartData.co2Intensity).toFixed(1)}</strong>
                </div>
                <div className="stat-item">
                  <span>Max: </span>
                  <strong>{Math.max(...chartData.co2Intensity).toFixed(1)}</strong>
                </div>
                <div className="stat-item">
                  <span>Avg: </span>
                  <strong>{(chartData.co2Intensity.reduce((a, b) => a + b, 0) / chartData.co2Intensity.length).toFixed(1)}</strong>
                </div>
              </div>
              
              <div className="intensity-scale">
                <span>kg/MWh</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Engine;