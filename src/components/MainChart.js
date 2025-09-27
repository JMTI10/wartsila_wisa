import React from 'react';
import './MainChart.css';
import ChartContainer from './ChartContainer';

const MainChart = () => {
  return (
    <div className="main-chart">
      {/* Chart 1 - Top Chart */}
      <div className="chart-row">
        <ChartContainer 
          title="Performance Metrics"
          chartId="chart-1"
        />
      </div>
      
      {/* Chart 2 - Bottom Chart */}
      <div className="chart-row">
        <ChartContainer 
          title="Usage Statistics" 
          chartId="chart-2"
        />
      </div>
    </div>
  );
};

export default MainChart;