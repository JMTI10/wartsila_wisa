import React from 'react';
import { Link } from 'react-router-dom';
import './Engine.css';

const Engine = () => {
  return (
    <div className="engine-page">
      {/* Same Header as Main Page */}
      <div className="main-chart-header">
        <div className="header-left">
          <div className="header-brand">
            <h1>Wartsila</h1>
            <h2>Wisa Analytics</h2>
          </div>
          <p className="header-subtitle">Engine Monitoring & Performance</p>
        </div>
        
        {/* Back to Dashboard Link */}
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
          <h2>Name ID</h2>
          <div className="section-content">
            <div className="data-item">
              <label>Engine Name:</label>
              <span className="value">Wärtsilä 31</span>
            </div>
            <div className="data-item">
              <label>Engine ID:</label>
              <span className="value">WT-31-2023-001</span>
            </div>
            <div className="data-item">
              <label>Status:</label>
              <span className="value status-active">Active</span>
            </div>
          </div>
        </div>

        {/* 2. Efficiency */}
        <div className="engine-section efficiency-section">
          <h2>Efficiency</h2>
          <div className="section-content">
            <div className="data-item">
              <label>Heat Rate:</label>
              <span className="value">6,850 kJ/kWh</span>
            </div>
            <div className="data-item">
              <label>Thermal Efficiency:</label>
              <span className="value">52.5%</span>
            </div>
          </div>
        </div>

        {/* 3. Cost Carbon */}
        <div className="engine-section cost-carbon-section">
          <h2>Cost Carbon</h2>
          <div className="section-content">
            <div className="data-item">
              <label>Total Cost:</label>
              <span className="value">$12,450</span>
            </div>
            <div className="data-item">
              <label>Carbon Cost:</label>
              <span className="value">$2,180</span>
            </div>
          </div>
        </div>

        {/* 4. Emissions */}
        <div className="engine-section emissions-section">
          <h2>Emissions</h2>
          <div className="section-content">
            <div className="data-item">
              <label>Carbon Emissions:</label>
              <span className="value">245 tCO₂</span>
            </div>
            <div className="data-item">
              <label>CO2 Intensity:</label>
              <span className="value">420 g/kWh</span>
            </div>
            <div className="data-item">
              <label>NOx RHTE:</label>
              <span className="value">1.8 g/kWh</span>
            </div>
            <div className="data-item">
              <label>CO2 Rate:</label>
              <span className="value">650 kg/h</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Engine;