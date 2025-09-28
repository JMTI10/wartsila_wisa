import React from 'react';
import './DataDisplay.css';

const DataDisplay = ({ plantData, selectedMetrics = [] }) => {
  if (!plantData) {
    return (
      <div className="data-display">
        <div className="no-data">
          <p>Loading plant data...</p>
        </div>
      </div>
    );
  }

  if (selectedMetrics.length === 0) {
    return (
      <div className="data-display">
        <div className="no-metrics">
          <p>Select metrics from the sidebar to display data</p>
        </div>
      </div>
    );
  }

  // Helper function to get metric values with proper formatting
  const getMetricValue = (metricName) => {
    try {
      // Other Emissions & Pollutants
      if (metricName === "Total NOx Emissions (tons)") return plantData.other_emissions?.total_nox_all_time?.toLocaleString();
      if (metricName === "Total SOx Emissions (tons)") return plantData.other_emissions?.total_sox_all_time?.toLocaleString();
      if (metricName === "Total PM10 Emissions (kg)") return plantData.other_emissions?.total_pm10_all_time?.toLocaleString();
      if (metricName === "Total PM2.5 Emissions (kg)") return plantData.other_emissions?.total_pm25_all_time?.toLocaleString();
      if (metricName === "Total Heavy Metals (kg)") return plantData.other_emissions?.total_heavy_metals_all_time?.toLocaleString();
      if (metricName === "Total Mercury (kg)") return plantData.other_emissions?.total_mercury_all_time?.toLocaleString();
      if (metricName === "Total VOCs (kg)") return plantData.other_emissions?.total_vocs_all_time?.toLocaleString();
      if (metricName === "Emissions Measurement Period") return plantData.other_emissions?.measurement_period;

      // Operating & Financial Metrics
      if (metricName === "Total Fuel Cost ($)") return plantData.operating_summary?.total_all_time_fuel_cost ? `$${plantData.operating_summary.total_all_time_fuel_cost.toLocaleString()}` : "N/A";
      if (metricName === "Cost per MWh Produced ($/MWh)") return plantData.operating_summary?.cost_per_mwh_produced ? `$${plantData.operating_summary.cost_per_mwh_produced}` : "N/A";
      if (metricName === "Operating Summary Measurement Period") return plantData.operating_summary?.measurement_period;

      // Allowances & Compliance
      if (metricName === "Allocation Year") return plantData.allowances?.allocation_year;
      if (metricName === "Total Allowances Available") return plantData.allowances?.total_allowances_available?.toLocaleString();
      if (metricName === "Estimated CO2 Emissions") return plantData.allowances?.estimated_co2_emissions?.toLocaleString();
      if (metricName === "Allowances Needed") return plantData.allowances?.allowances_needed?.toLocaleString();
      if (metricName === "Allowances Surplus") return plantData.allowances?.allowances_surplus?.toLocaleString();

      // Data Completeness
      if (metricName === "Engines Data Available") return plantData.data_completeness?.engines_data ? "✅ Available" : "❌ Unavailable";
      if (metricName === "Emissions Data Available") return plantData.data_completeness?.emissions_data ? "✅ Available" : "❌ Unavailable";
      if (metricName === "Fuel Consumption Data Available") return plantData.data_completeness?.fuel_consumption_data ? "✅ Available" : "❌ Unavailable";
      if (metricName === "Generation Data Available") return plantData.data_completeness?.generation_data ? "✅ Available" : "❌ Unavailable";
      if (metricName === "Allowances Data Available") return plantData.data_completeness?.allowances_data ? "✅ Available" : "❌ Unavailable";
      
      return "N/A";
    } catch (error) {
      return "Error";
    }
  };

  // Get icon for each metric category
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Other Emissions & Pollutants": return "⚠️";
      case "Operating & Financial Metrics": return "💰";
      case "Allowances & Compliance": return "📊";
      case "Data Completeness": return "✅";
      default: return "📈";
    }
  };

  // Group metrics by category for better organization
  const groupMetricsByCategory = () => {
    const categories = {
      "Other Emissions & Pollutants": [],
      "Operating & Financial Metrics": [],
      "Allowances & Compliance": [],
      "Data Completeness": []
    };

    selectedMetrics.forEach(metric => {
      if (metric.includes("NOx") || metric.includes("SOx") || metric.includes("PM") || metric.includes("Heavy Metals") || metric.includes("Mercury") || metric.includes("VOCs") || metric.includes("Emissions Measurement")) {
        categories["Other Emissions & Pollutants"].push(metric);
      } else if (metric.includes("Fuel Cost") || metric.includes("Cost per MWh") || metric.includes("Operating Summary")) {
        categories["Operating & Financial Metrics"].push(metric);
      } else if (metric.includes("Allocation") || metric.includes("Allowances") || metric.includes("Estimated CO2")) {
        categories["Allowances & Compliance"].push(metric);
      } else if (metric.includes("Data Available")) {
        categories["Data Completeness"].push(metric);
      }
    });

    return categories;
  };

  const categorizedMetrics = groupMetricsByCategory();

  return (
    <div className="data-display">
      <div className="data-display-header">
        <h2>Detailed Metrics Display</h2>
        <span className="metrics-count">{selectedMetrics.length} metrics selected</span>
      </div>
      
      <div className="metrics-container">
        {Object.entries(categorizedMetrics).map(([category, metrics]) => (
          metrics.length > 0 && (
            <div key={category} className="metric-category-section">
              <div className="category-header">
                <span className="category-icon">{getCategoryIcon(category)}</span>
                <h3 className="category-title">{category}</h3>
                <span className="metrics-count">{metrics.length} metrics</span>
              </div>
              <div className="metrics-grid">
                {metrics.map((metric, index) => (
                  <div key={index} className="metric-card">
                    <div className="metric-header">
                      <span className="metric-name">{metric}</span>
                    </div>
                    <div className="metric-value-container">
                      <span className="metric-value">{getMetricValue(metric)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default DataDisplay;