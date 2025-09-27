import React from 'react';
import './MainChart.css';
import ChartContainer from './ChartContainer';
import DataDisplay from './DataDisplay';
import { Link } from 'react-router-dom';

const MainChart = () => {
  return (
    <div className="main-chart-component">
      {/* HEADER WITH ENGINE LINK */}
      <div className="main-chart-header">
        <div className="header-left">
          <div className="header-brand">
            <h1>Wartsila</h1>
            <h2>Wisa Analytics</h2>
          </div>
          <p className="header-subtitle">Real-time emissions monitoring and analysis</p>
        </div>
        
        {/* ENGINE LINK ON THE RIGHT SIDE */}
        <div className="header-right">
          <Link to="/engine" className="engine-link">
            <span className="engine-icon">⚙️</span>
            <span>Engine</span>
          </Link>
        </div>
      </div>
      
      {/* CHARTS SECTION */}
      <div className="charts-section">
        <div className="charts-horizontal">
          <ChartContainer 
            title="Performance Overview"
            chartId="chart-1"
          />
          <ChartContainer 
            title="Usage Statistics" 
            chartId="chart-2"
          />
        </div>
      </div>
      
      {/* DATA DISPLAY BELOW */}
      <div className="data-display-section">
        <DataDisplay />
      </div>
    </div>
  );
};

export default MainChart;