import React from 'react';
import './DataDisplay.css';

const DataDisplay = ({ plantData, selectedMetrics = [] }) => {
  // Handle loading state
  if (plantData?.loading || !plantData) {
    return (
      <div className="data-display">
        <div className="no-data">
          <p>Loading plant data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (plantData?.error) {
    return (
      <div className="data-display">
        <div className="no-data">
          <p>Error: {plantData.error}</p>
        </div>
      </div>
    );
  }

  // Handle no selected metrics
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
      const data = plantData.overview; // Access overview from plantData
      if (!data) return "N/A";

      // Plant & Engine Overview
      if (metricName === "Plant ID") return data.plant_id || "N/A";
      if (metricName === "Plant Name") return data.plant_name || "N/A";
      if (metricName === "Total Engines Count") return data.engines?.total_count?.toLocaleString() || "N/A";
      if (metricName === "Active Engines Count") return data.engines?.active_count?.toLocaleString() || "N/A";
      if (metricName === "Engines in Maintenance") return data.engines?.maintenance_count?.toLocaleString() || "N/A";
      if (metricName === "Total Nameplate Capacity (MW)") return data.engines?.total_nameplate_capacity?.toLocaleString() || "N/A";
      if (metricName === "Engine Models") return data.engines?.engines_list?.map(engine => engine.model).join(", ") || "N/A";
      if (metricName === "Engine Status") return data.engines?.engines_list?.map(engine => `${engine.engine_id}: ${engine.status}`).join(", ") || "N/A";

      // Energy Production Metrics
      if (metricName === "Total Gross Generation (MWh)") return data.energy_totals?.total_gross_generation?.toLocaleString() || "N/A";
      if (metricName === "Total Net Generation (MWh)") return data.energy_totals?.total_net_generation?.toLocaleString() || "N/A";
      if (metricName === "Total Auxiliary Power (MWh)") return data.energy_totals?.total_auxiliary_power?.toLocaleString() || "N/A";
      if (metricName === "Total Operating Hours") return data.energy_totals?.total_operating_hours?.toLocaleString() || "N/A";
      if (metricName === "Average Capacity Factor (%)") return data.energy_totals?.average_capacity_factor ? `${(data.energy_totals.average_capacity_factor * 100).toFixed(2)}%` : "N/A";
      if (metricName === "Measurement Period") return data.energy_totals?.measurement_period || "N/A";

      // Carbon Emissions
      if (metricName === "Total CO2 Emissions (tons)") return data.carbon_emissions?.total_co2_all_time?.toLocaleString() || "N/A";
      if (metricName === "CO2 Equivalent Total (tons)") return data.carbon_emissions?.co2_equivalent_total?.toLocaleString() || "N/A";
      if (metricName === "Carbon Emissions Measurement Period") return data.carbon_emissions?.measurement_period || "N/A";

      // Other Emissions & Pollutants
      if (metricName === "Total NOx Emissions (tons)") return data.other_emissions?.total_nox_all_time?.toLocaleString() || "N/A";
      if (metricName === "Total SOx Emissions (tons)") return data.other_emissions?.total_sox_all_time?.toLocaleString() || "N/A";
      if (metricName === "Total PM10 Emissions (kg)") return data.other_emissions?.total_pm10_all_time?.toLocaleString() || "N/A";
      if (metricName === "Total PM2.5 Emissions (kg)") return data.other_emissions?.total_pm25_all_time?.toLocaleString() || "N/A";
      if (metricName === "Total Heavy Metals (kg)") return data.other_emissions?.total_heavy_metals_all_time?.toLocaleString() || "N/A";
      if (metricName === "Total Mercury (kg)") return data.other_emissions?.total_mercury_all_time?.toLocaleString() || "N/A";
      if (metricName === "Total VOCs (kg)") return data.other_emissions?.total_vocs_all_time?.toLocaleString() || "N/A";
      if (metricName === "Emissions Measurement Period") return data.other_emissions?.measurement_period || "N/A";

      // Operating & Financial Metrics
      if (metricName === "Total Fuel Cost ($)") return data.operating_summary?.total_all_time_fuel_cost ? `$${data.operating_summary.total_all_time_fuel_cost.toLocaleString()}` : "N/A";
      if (metricName === "Cost per MWh Produced ($/MWh)") return data.operating_summary?.cost_per_mwh_produced ? `$${data.operating_summary.cost_per_mwh_produced.toLocaleString()}` : "N/A";
      if (metricName === "Operating Summary Measurement Period") return data.operating_summary?.measurement_period || "N/A";

      // Allowances & Compliance
      if (metricName === "Allocation Year") return data.allowances?.allocation_year || "N/A";
      if (metricName === "Total Allowances Available") return data.allowances?.total_allowances_available?.toLocaleString() || "N/A";
      if (metricName === "Estimated CO2 Emissions") return data.allowances?.estimated_co2_emissions?.toLocaleString() || "N/A";
      if (metricName === "Allowances Needed") return data.allowances?.allowances_needed?.toLocaleString() || "N/A";
      if (metricName === "Allowances Surplus") return data.allowances?.allowances_surplus?.toLocaleString() || "N/A";

      // Data Completeness
      if (metricName === "Engines Data Available") return data.data_completeness?.engines_data ? "✅ Available" : "❌ Unavailable";
      if (metricName === "Emissions Data Available") return data.data_completeness?.emissions_data ? "✅ Available" : "❌ Unavailable";
      if (metricName === "Fuel Consumption Data Available") return data.data_completeness?.fuel_consumption_data ? "✅ Available" : "❌ Unavailable";
      if (metricName === "Generation Data Available") return data.data_completeness?.generation_data ? "✅ Available" : "❌ Unavailable";
      if (metricName === "Allowances Data Available") return data.data_completeness?.allowances_data ? "✅ Available" : "❌ Unavailable";

      return "N/A";
    } catch (error) {
      return "Error";
    }
  };

  // Get icon for each metric category
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Plant & Engine Overview": return "🏭";
      case "Energy Production Metrics": return "⚡";
      case "Carbon Emissions": return "🌫️";
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
      "Plant & Engine Overview": [],
      "Energy Production Metrics": [],
      "Carbon Emissions": [],
      "Other Emissions & Pollutants": [],
      "Operating & Financial Metrics": [],
      "Allowances & Compliance": [],
      "Data Completeness": []
    };

    selectedMetrics.forEach(metric => {
      if (metric.includes("Plant ID") || metric.includes("Plant Name") || metric.includes("Engines") || metric.includes("Nameplate Capacity") || metric.includes("Engine Models") || metric.includes("Engine Status")) {
        categories["Plant & Engine Overview"].push(metric);
      } else if (metric.includes("Generation") || metric.includes("Operating Hours") || metric.includes("Capacity Factor") || (metric.includes("Measurement Period") && !metric.includes("Emissions") && !metric.includes("Operating Summary"))) {
        categories["Energy Production Metrics"].push(metric);
      } else if (metric.includes("CO2") && !metric.includes("Estimated")) {
        categories["Carbon Emissions"].push(metric);
      } else if (metric.includes("NOx") || metric.includes("SOx") || metric.includes("PM") || metric.includes("Heavy Metals") || metric.includes("Mercury") || metric.includes("VOCs") || metric.includes("Emissions Measurement")) {
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