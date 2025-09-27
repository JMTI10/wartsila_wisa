import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const [selectedMetrics, setSelectedMetrics] = useState(new Set());
  const [expandedCategories, setExpandedCategories] = useState(new Set([0, 1, 2, 3, 4])); // Start with all expanded

  const metricCategories = [
    {
      title: "Carbon Intensity & Absolute Emissions",
      icon: "📈",
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
      icon: "🌫️",
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
      icon: "⚖️",
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
      icon: "🎯",
      metrics: [
        "Year-over-year emissions reduction",
        "Emissions avoided through efficiency",
        "Carbon footprint per customer",
        "Grid emission factors - Regional",
        "Grid emission factors - Seasonal",
        "Peak vs off-peak emission factors"
      ]
    },
    {
      title: "Operational Sustainability Metrics",
      icon: "🌱",
      metrics: [
        "Resource Efficiency",
        "Energy return on energy invested (EROI)",
        "Fuel utilization efficiency by technology type",
        "Seasonal efficiency variations",
        "Load factor optimization",
        "Environmental Impact Indicators",
        "Air emissions per unit of useful energy",
        "Pollutant intensity vs regulatory limits",
        "Environmental compliance rates",
        "Avoided emissions from renewable generation"
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

  const toggleCategory = (index) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedCategories(new Set(metricCategories.map((_, index) => index)));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  const selectAll = () => {
    const allMetrics = metricCategories.flatMap(category => category.metrics);
    setSelectedMetrics(new Set(allMetrics));
  };

  const clearAll = () => {
    setSelectedMetrics(new Set());
  };

  const isSubcategoryHeader = (metric) => {
    const subcategoryHeaders = [
      "Resource Efficiency",
      "Environmental Impact Indicators"
    ];
    return subcategoryHeaders.includes(metric);
  };

  return (
    <div className="sidebar-component">
      <div className="sidebar-header">
        <h2>Emissions Metrics Dashboard</h2>
        <p>Select metrics to display</p>
      </div>
      
      <div className="sidebar-controls">
          <div className="controls-row">
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
      <div className="controls-row">
          <button className="control-btn expand-all" onClick={expandAll}>
            Expand All
          </button>
          <button className="control-btn collapse-all" onClick={collapseAll}>
            Collapse All
          </button>
      </div>
      </div>
      
      <div className="sidebar-content">
        {metricCategories.map((category, index) => {
          const isExpanded = expandedCategories.has(index);
          const categoryMetrics = category.metrics;
          const selectedInCategory = categoryMetrics.filter(metric => selectedMetrics.has(metric)).length;
          
          return (
            <div key={index} className="metric-category">
              <div 
                className="category-header"
                onClick={() => toggleCategory(index)}
              >
                <div className="category-title">
                  <span className="category-icon">{category.icon}</span>
                  {category.title}
                  <span className="category-stats">
                    ({selectedInCategory}/{categoryMetrics.length} selected)
                  </span>
                </div>
                <span className={`collapse-icon ${isExpanded ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
              
              {isExpanded && (
                <div className="metric-list">
                  {categoryMetrics.map((metric, metricIndex) => (
                    <label 
                      key={metricIndex} 
                      className={`metric-checkbox ${selectedMetrics.has(metric) ? 'checked' : ''} ${
                        isSubcategoryHeader(metric) ? 'subcategory-header' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMetrics.has(metric)}
                        onChange={() => !isSubcategoryHeader(metric) && toggleMetric(metric)}
                        className="metric-input"
                        disabled={isSubcategoryHeader(metric)}
                      />
                      <span className="checkmark"></span>
                      <span className="metric-label">{metric}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;