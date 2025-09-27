import React from 'react';
import './MainChart.css';
import ChartContainer from './ChartContainer';
import DataDisplay from './DataDisplay';

const MainChart = () => {
  return (
    <div className="main-chart-component">
      {/* ONLY HEADER - NO DUPLICATE TITLES */}
      <div className="main-chart-header">
        <div className="header-brand">
          <h1>Wartsila</h1>
          <h2>Wisa Analytics</h2>
        </div>
        <p className="header-subtitle">Real-time emissions monitoring and analysis</p>
      </div>
      
      {/* CHARTS SECTION - SIMPLE TITLES */}
      <div className="charts-section">
        <div className="charts-horizontal">
          <ChartContainer 
            title="Performance Overview"  // CHANGED FROM "Performance Metrics"
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