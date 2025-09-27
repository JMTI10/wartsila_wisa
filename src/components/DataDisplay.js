import React from 'react';
import './DataDisplay.css';

const DataDisplay = () => {
  return (
    <div className="data-display">
      {/* Top row - Small containers for numerical values */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-header">
            <h3>Carbon Intensity</h3>
            <span className="metric-trend positive">↓ 12%</span>
          </div>
          <div className="metric-value">245 kg CO₂/MWh</div>
          <div className="metric-subtitle">Current Period</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <h3>Total Emissions</h3>
            <span className="metric-trend negative">↑ 8%</span>
          </div>
          <div className="metric-value">12,458 tCO₂e</div>
          <div className="metric-subtitle">YTD</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <h3>Efficiency</h3>
            <span className="metric-trend positive">↑ 15%</span>
          </div>
          <div className="metric-value">94.2%</div>
          <div className="metric-subtitle">Overall</div>
        </div>
      </div>

      {/* Bottom row - Larger containers for charts */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Emissions Trend</h3>
            <span className="chart-period">Last 12 Months</span>
          </div>
          <div className="chart-placeholder">
            <div className="placeholder-graph">
              <div className="graph-bar" style={{height: '40%'}}></div>
              <div className="graph-bar" style={{height: '60%'}}></div>
              <div className="graph-bar" style={{height: '55%'}}></div>
              <div className="graph-bar" style={{height: '75%'}}></div>
              <div className="graph-bar" style={{height: '65%'}}></div>
              <div className="graph-bar" style={{height: '50%'}}></div>
              <div className="graph-bar" style={{height: '45%'}}></div>
              <div className="graph-bar" style={{height: '35%'}}></div>
              <div className="graph-bar" style={{height: '30%'}}></div>
              <div className="graph-bar" style={{height: '25%'}}></div>
              <div className="graph-bar" style={{height: '20%'}}></div>
              <div className="graph-bar" style={{height: '15%'}}></div>
            </div>
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-header">
            <h3>Fuel Mix Analysis</h3>
            <span className="chart-period">Current Month</span>
          </div>
          <div className="chart-placeholder">
            <div className="pie-chart-placeholder">
              <div className="pie-segment coal"></div>
              <div className="pie-segment gas"></div>
              <div className="pie-segment oil"></div>
              <div className="pie-segment renewable"></div>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <span className="legend-color coal"></span>
                <span>Coal: 35%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color gas"></span>
                <span>Gas: 40%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color oil"></span>
                <span>Oil: 15%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color renewable"></span>
                <span>Renewable: 10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDisplay;