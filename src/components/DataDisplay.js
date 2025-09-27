import React from 'react';
import './DataDisplay.css';

const DataDisplay = () => {
  return (
    <div className="data-display">
      {/* Top row - Small containers for numerical values */}
      <div className="metrics-row">
        <div className="metric-container">
          <span className="placeholder-text">placeholder</span>
        </div>
        <div className="metric-container">
          <span className="placeholder-text">placeholder</span>
        </div>
      </div>

      {/* Bottom row - Larger containers for charts */}
      <div className="charts-row">
        <div className="chart-container">
          <span className="placeholder-text">placeholder</span>
        </div>
        <div className="chart-container">
          <span className="placeholder-text">placeholder</span>
        </div>
      </div>
    </div>
  );
};

export default DataDisplay;