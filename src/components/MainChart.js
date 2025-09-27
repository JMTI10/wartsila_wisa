import React from 'react';
import './MainChart.css';
import ChartContainer from './ChartContainer';
import DataDisplay from './DataDisplay';

const MainChart = () => {
  return (
    <div className="main-chart-component">
      <div className="main-chart-header">
        <h1>Wartsila Wisa Analytics</h1>
        <p>Real-time emissions monitoring and analysis</p>
      </div>
      
      {/* Top Section: Two small charts side by side */}
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
      
      {/* Data Display Section below the charts */}
      <DataDisplay />
    </div>
  );
};

export default MainChart;