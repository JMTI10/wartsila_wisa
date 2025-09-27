import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const [selectedMetrics, setSelectedMetrics] = useState(new Set());

  const metricCategories = [
    {
      title: "Carbon Intensity & Absolute Emissions",
      metrics: [
        "Carbon intensity of electricity generation (kg CO2/MWh)",
        "Scope 1 - Direct emissions",
        "Scope 2 - Electricity emissions", 
        "Scope 3 - Value chain emissions",
        "Coal emissions",
        "Natural gas emissions",
        "Oil emissions",
        "Renewable sources emissions"
      ]
    },
    {
      title: "Greenhouse Gas & Air Pollutants",
      metrics: [
        "CO2 emissions",
        "CH4 (Methane) emissions", 
        "N2O (Nitrous Oxide) emissions",
        "CO2 equivalent total",
        "NOx (Nitrogen Oxides)",
        "SOx (Sulfur Oxides)",
        "Particulate matter (PM)"
      ]
    },
    {
      title: "Emissions Intensity Metrics",
      metrics: [
        "Carbon intensity of electricity generation",
        "Emissions per unit of revenue (tCO2e/$)",
        "Emissions per unit of production (tCO2e/unit)",
        "Coal emission factor (kg CO2/unit)",
        "Natural gas emission factor", 
        "Oil emission factor",
        "Renewable source emission factor"
      ]
    },
    {
      title: "Emissions Performance Indicators",
      metrics: [
        "Year-over-year emissions reduction",
        "Emissions avoided through efficiency",
        "Carbon footprint per customer",
        "Grid emission factors - Regional",
        "Grid emission factors - Seasonal",
        "Peak vs off-peak emission factors"
      ]
    }
  ];

  const toggleMetric = (metric) => {
    setSelectedMetrics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(metric)) {
        newSet.delete(metric);
      } else {
        newSet.add(metric);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const allMetrics = metricCategories.flatMap(category => category.metrics);
    setSelectedMetrics(new Set(allMetrics));
  };

  const clearAll = () => {
    setSelectedMetrics(new Set());
  };

  return (
    <div className="sidebar-component">
      <div className="sidebar-header">
        <h2>Emissions Metrics Dashboard</h2>
        <p>Select metrics to display</p>
      </div>
      
      <div className="sidebar-controls">
        <button className="control-btn select-all" onClick={selectAll}>
          Select All
        </button>
        <button className="control-btn clear-all" onClick={clearAll}>
          Clear All
        </button>
        <span className="selected-count">
          {selectedMetrics.size} metrics selected
        </span>
      </div>
      
      <div className="sidebar-content">
        {metricCategories.map((category, index) => (
          <div key={index} className="metric-category">
            <h3 className="category-title">
              <span className="category-icon">📊</span>
              {category.title}
            </h3>
            <div className="metric-list">
              {category.metrics.map((metric, metricIndex) => (
                <label 
                  key={metricIndex} 
                  className={`metric-checkbox ${selectedMetrics.has(metric) ? 'checked' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMetrics.has(metric)}
                    onChange={() => toggleMetric(metric)}
                    className="metric-input"
                  />
                  <span className="checkmark"></span>
                  <span className="metric-label">{metric}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;