import React from 'react';
import './ChartContainer.css';

const ChartContainer = ({ title, chartId, children }) => {
  return (
    <div className="chart-container" id={chartId}>
      <div className="chart-header">
        <h3>{title}</h3>
      </div>
      <div className="chart-content">
        {children || (
          <div className="chart-placeholder">
            <p>Chart will be displayed here</p>
            <div className="placeholder-chart">
              {/* Simple SVG placeholder for the chart */}
              <svg width="100%" height="200" viewBox="0 0 400 200">
                <rect width="400" height="200" fill="#f0f0f0" />
                <path 
                  d="M50,150 L100,100 L150,120 L200,80 L250,130 L300,70 L350,140" 
                  stroke="#007bff" 
                  strokeWidth="2" 
                  fill="none"
                />
                <text x="200" y="190" textAnchor="middle" fill="#666">
                  Chart Area - {title}
                </text>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartContainer;