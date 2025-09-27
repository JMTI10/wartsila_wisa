import React from 'react';
import './MainChart.css';
import ChartContainer from './ChartContainer';

const MainChart = () => {
  return (
    <div className="main-chart-component">
      <div className="main-chart-header">
        <h1>Wartsila Wisa Analytics</h1>
      </div>
      
      <div className="charts-horizontal">
        <ChartContainer 
          title="Performance Metrics"
          chartId="chart-1"
        />
        <ChartContainer 
          title="Usage Statistics" 
          chartId="chart-2"
        />
      </div>
    </div>
  );
};

export default MainChart;