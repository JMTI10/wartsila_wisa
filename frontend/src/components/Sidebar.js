import React, { useState, useEffect } from 'react';
import './Sidebar.css';

const Sidebar = ({ onPlantSelect, onMetricsChange }) => {
  const [selectedMetrics, setSelectedMetrics] = useState(new Set());
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [activePlant, setActivePlant] = useState(1);
  const [plantsExpanded, setPlantsExpanded] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Plant data for navigation
  const plants = [
    { id: 1, plant_id: "PP-001", plant_name: "Riverside Coal Power Station" },
    { id: 2, plant_id: "PP-002", plant_name: "Mountain View Power Plant" },
    { id: 3, plant_id: "PP-003", plant_name: "Lake Side Energy Center" }
  ];

  // Function to fetch data from API
  const fetchPlantData = async (plantId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3001/api/operations/engines/${plantId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setApiData(data);
      
      // If you want to automatically update the available metrics based on API response
      updateMetricCategoriesFromAPI(data);
      
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
      console.error('Error fetching plant data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update metric categories based on API response
  const updateMetricCategoriesFromAPI = (data) => {
    if (!data) return;
    
    // You can dynamically update available metrics based on what's actually in the API response
    // This is optional - you might want to keep your predefined categories
    
    // For example, if you want to only show metrics that have data:
    // const availableMetrics = Object.keys(data);
    // Update your metric categories accordingly
  };

  // Fetch data when component mounts or active plant changes
  useEffect(() => {
    fetchPlantData(activePlant);
  }, [activePlant]);

  // Metric categories based on actual API data structure
  const metricCategories = [
    {
      title: "Plant & Engine Overview",
      icon: "🏭",
      metrics: [
        "Plant ID",
        "Plant Name",
        "Total Engines Count",
        "Active Engines Count",
        "Engines in Maintenance",
        "Total Nameplate Capacity (MW)",
        "Engine Models",
        "Engine Status"
      ]
    },
    {
      title: "Energy Production Metrics",
      icon: "⚡",
      metrics: [
        "Total Gross Generation (MWh)",
        "Total Net Generation (MWh)",
        "Total Auxiliary Power (MWh)",
        "Total Operating Hours",
        "Average Capacity Factor (%)",
        "Measurement Period"
      ]
    },
    {
      title: "Carbon Emissions",
      icon: "🌫️",
      metrics: [
        "Total CO2 Emissions (tons)",
        "CO2 Equivalent Total (tons)",
        "Carbon Emissions Measurement Period"
      ]
    },
    {
      title: "Other Emissions & Pollutants",
      icon: "⚠️",
      metrics: [
        "Total NOx Emissions (tons)",
        "Total SOx Emissions (tons)",
        "Total PM10 Emissions (kg)",
        "Total PM2.5 Emissions (kg)",
        "Total Heavy Metals (kg)",
        "Total Mercury (kg)",
        "Total VOCs (kg)",
        "Emissions Measurement Period"
      ]
    },
    {
      title: "Operating & Financial Metrics",
      icon: "💰",
      metrics: [
        "Total Fuel Cost ($)",
        "Cost per MWh Produced ($/MWh)",
        "Operating Summary Measurement Period"
      ]
    },
    {
      title: "Allowances & Compliance",
      icon: "📊",
      metrics: [
        "Allocation Year",
        "Total Allowances Available",
        "Estimated CO2 Emissions",
        "Allowances Needed",
        "Allowances Surplus"
      ]
    },
    {
      title: "Data Completeness",
      icon: "✅",
      metrics: [
        "Engines Data Available",
        "Emissions Data Available",
        "Fuel Consumption Data Available",
        "Generation Data Available",
        "Allowances Data Available"
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
      
      if (onMetricsChange) {
        onMetricsChange(Array.from(newSet), apiData);
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

  const togglePlantsSection = () => {
    setPlantsExpanded(prev => !prev);
  };

  const expandAll = () => {
    setExpandedCategories(new Set(metricCategories.map((_, index) => index)));
    setPlantsExpanded(true);
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
    setPlantsExpanded(false);
  };

  const selectAll = () => {
    const allMetrics = metricCategories.flatMap(category => category.metrics);
    const newSet = new Set(allMetrics);
    setSelectedMetrics(newSet);
    
    if (onMetricsChange) {
      onMetricsChange(Array.from(newSet), apiData);
    }
  };

  const clearAll = () => {
    setSelectedMetrics(new Set());
    
    if (onMetricsChange) {
      onMetricsChange([], apiData);
    }
  };

  const handlePlantSelect = (plantId) => {
    setActivePlant(plantId);
    if (onPlantSelect) {
      onPlantSelect(plantId);
    }
    // Data will be fetched automatically due to useEffect dependency on activePlant
  };

  const refreshData = () => {
    fetchPlantData(activePlant);
  };

  return (
    <div className="sidebar-component">
      {/* API Status Indicator */}
      {loading && (
        <div className="api-status loading">
          <span>🔄</span> Loading data...
        </div>
      )}


      {/* Plants Navigation Section */}
      <div className="plants-navigation">
        <div 
          className="plants-header"
          onClick={togglePlantsSection}
        >
          <h3>
            <span className="plants-icon">🏭</span>
            Power Plants
            <span className={`plants-collapse-icon ${plantsExpanded ? 'expanded' : ''}`}>
              ▼
            </span>
          </h3>
        </div>
        {plantsExpanded && (
          <div className="plants-list">
            {plants.map(plant => (
              <div 
                key={plant.id}
                className={`plant-item ${activePlant === plant.id ? 'active' : ''}`}
                onClick={() => handlePlantSelect(plant.id)}
              >
                <span className="plant-id">{plant.plant_id}</span>
                <span className="plant-name">{plant.plant_name}</span>
              </div>
            ))}
          </div>
        )}
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Sidebar;