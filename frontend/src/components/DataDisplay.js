import React from 'react';
import './DataDisplay.css';

const DataDisplay = ({ plantData, selectedMetrics = [], currentPlant }) => {
  // Debug logging to see what data we're receiving
  console.log('DataDisplay - plantData:', plantData);
  console.log('DataDisplay - currentPlant:', currentPlant);
  console.log('DataDisplay - selectedMetrics:', selectedMetrics);

  // Extract the actual plant data from the combined data structure
  // Handle both the expected structure and direct data
  const actualPlantData = plantData?.overview || plantData;
  const loading = plantData?.loading || false;
  const error = plantData?.error;
  const sidebarData = plantData?.engines; // Engine data from sidebar

  console.log('DataDisplay - actualPlantData:', actualPlantData);
  console.log('DataDisplay - sidebarData:', sidebarData);

  if (loading) {
    return (
      <div className="data-display">
        <div className="no-data loading">
          <div className="spinner"></div>
          <p>Loading plant data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-display">
        <div className="no-data error">
          <p>Error loading plant data: {error}</p>
        </div>
      </div>
    );
  }

  if (!actualPlantData) {
    return (
      <div className="data-display">
        <div className="no-data">
          <p>No plant data available</p>
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
      // Plant & Engine Overview (using both actualPlantData and sidebarData)
      if (metricName === "Plant ID") return actualPlantData.plant_id;
      if (metricName === "Plant Name") return actualPlantData.plant_name;
      if (metricName === "Total Engines Count") return actualPlantData.engines?.total_count || sidebarData?.total_count;
      if (metricName === "Active Engines Count") return actualPlantData.engines?.active_count || sidebarData?.active_count;
      if (metricName === "Engines in Maintenance") return actualPlantData.engines?.maintenance_count || sidebarData?.maintenance_count;
      if (metricName === "Total Nameplate Capacity (MW)") return actualPlantData.engines?.total_nameplate_capacity || sidebarData?.total_nameplate_capacity;
      if (metricName === "Engine Models") return actualPlantData.engines?.engines_list?.map(engine => engine.model).join(", ") || sidebarData?.engines_list?.map(engine => engine.model).join(", ");
      if (metricName === "Engine Status") return `${actualPlantData.engines?.active_count || sidebarData?.active_count || 0} active, ${actualPlantData.engines?.maintenance_count || sidebarData?.maintenance_count || 0} maintenance`;

      // Energy Production Metrics
      if (metricName === "Total Gross Generation (MWh)") return actualPlantData.energy_totals?.total_gross_generation?.toLocaleString();
      if (metricName === "Total Net Generation (MWh)") return actualPlantData.energy_totals?.total_net_generation?.toLocaleString();
      if (metricName === "Total Auxiliary Power (MWh)") return actualPlantData.energy_totals?.total_auxiliary_power?.toLocaleString();
      if (metricName === "Total Operating Hours") return actualPlantData.energy_totals?.total_operating_hours?.toLocaleString();
      if (metricName === "Average Capacity Factor (%)") return actualPlantData.energy_totals?.average_capacity_factor;
      if (metricName === "Measurement Period") return actualPlantData.energy_totals?.measurement_period;

      // Carbon Emissions
      if (metricName === "Total CO2 Emissions (tons)") return actualPlantData.carbon_emissions?.total_co2_all_time ? Math.round(actualPlantData.carbon_emissions.total_co2_all_time / 1000).toLocaleString() : "N/A";
      if (metricName === "CO2 Equivalent Total (tons)") return actualPlantData.carbon_emissions?.co2_equivalent_total ? Math.round(actualPlantData.carbon_emissions.co2_equivalent_total / 1000).toLocaleString() : "N/A";
      if (metricName === "Carbon Emissions Measurement Period") return actualPlantData.carbon_emissions?.measurement_period;

      // Other Emissions & Pollutants
      if (metricName === "Total NOx Emissions (tons)") return actualPlantData.other_emissions?.total_nox_all_time?.toLocaleString();
      if (metricName === "Total SOx Emissions (tons)") return actualPlantData.other_emissions?.total_sox_all_time?.toLocaleString();
      if (metricName === "Total PM10 Emissions (kg)") return actualPlantData.other_emissions?.total_pm10_all_time?.toLocaleString();
      if (metricName === "Total PM2.5 Emissions (kg)") return actualPlantData.other_emissions?.total_pm25_all_time?.toLocaleString();
      if (metricName === "Total Heavy Metals (kg)") return actualPlantData.other_emissions?.total_heavy_metals_all_time?.toLocaleString();
      if (metricName === "Total Mercury (kg)") return actualPlantData.other_emissions?.total_mercury_all_time?.toLocaleString();
      if (metricName === "Total VOCs (kg)") return actualPlantData.other_emissions?.total_vocs_all_time?.toLocaleString();
      if (metricName === "Emissions Measurement Period") return actualPlantData.other_emissions?.measurement_period;

      // Operating & Financial Metrics
      if (metricName === "Total Fuel Cost ($)") return actualPlantData.operating_summary?.total_all_time_fuel_cost ? `$${actualPlantData.operating_summary.total_all_time_fuel_cost.toLocaleString()}` : "N/A";
      if (metricName === "Cost per MWh Produced ($/MWh)") return actualPlantData.operating_summary?.cost_per_mwh_produced ? `$${actualPlantData.operating_summary.cost_per_mwh_produced}` : "N/A";
      if (metricName === "Operating Summary Measurement Period") return actualPlantData.operating_summary?.measurement_period;

      // Allowances & Compliance
      if (metricName === "Allocation Year") return actualPlantData.allowances?.allocation_year;
      if (metricName === "Total Allowances Available") return actualPlantData.allowances?.total_allowances_available?.toLocaleString();
      if (metricName === "Estimated CO2 Emissions") return actualPlantData.allowances?.estimated_co2_emissions?.toLocaleString();
      if (metricName === "Allowances Needed") return actualPlantData.allowances?.allowances_needed?.toLocaleString();
      if (metricName === "Allowances Surplus") return actualPlantData.allowances?.allowances_surplus?.toLocaleString();

      // Data Completeness
      if (metricName === "Engines Data Available") return actualPlantData.data_completeness?.engines_data ? "✅ Available" : "❌ Unavailable";
      if (metricName === "Emissions Data Available") return actualPlantData.data_completeness?.emissions_data ? "✅ Available" : "❌ Unavailable";
      if (metricName === "Fuel Consumption Data Available") return actualPlantData.data_completeness?.fuel_consumption_data ? "✅ Available" : "❌ Unavailable";
      if (metricName === "Generation Data Available") return actualPlantData.data_completeness?.generation_data ? "✅ Available" : "❌ Unavailable";
      if (metricName === "Allowances Data Available") return actualPlantData.data_completeness?.allowances_data ? "✅ Available" : "❌ Unavailable";
      
      return "N/A";
    } catch (error) {
      console.error('Error getting metric value:', error);
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
      if (metric.includes("Plant ID") || metric.includes("Plant Name") || metric.includes("Engines Count") || metric.includes("Engine") || metric.includes("Nameplate Capacity")) {
        categories["Plant & Engine Overview"].push(metric);
      } else if (metric.includes("Generation") || metric.includes("Operating Hours") || metric.includes("Capacity Factor") || (metric.includes("Measurement Period") && !metric.includes("Carbon") && !metric.includes("Emissions") && !metric.includes("Operating Summary"))) {
        categories["Energy Production Metrics"].push(metric);
      } else if (metric.includes("CO2") || (metric.includes("Carbon") && metric.includes("Emissions"))) {
        categories["Carbon Emissions"].push(metric);
      } else if (metric.includes("NOx") || metric.includes("SOx") || metric.includes("PM") || metric.includes("Heavy Metals") || metric.includes("Mercury") || metric.includes("VOCs") || (metric.includes("Emissions Measurement Period"))) {
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
        <h2>Detailed Metrics Display - Plant {currentPlant}</h2>
        <span className="metrics-count">{selectedMetrics.length} metrics selected</span>
      </div>

      {/* Debug section - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-section">
          <strong>Debug Info:</strong>
          <div>Has plantData: {plantData ? 'Yes' : 'No'}</div>
          <div>Has actualPlantData: {actualPlantData ? 'Yes' : 'No'}</div>
          <div>Has sidebarData: {sidebarData ? 'Yes' : 'No'}</div>
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Error: {error || 'None'}</div>
          <div>Selected metrics count: {selectedMetrics.length}</div>
          {actualPlantData && (
            <details>
              <summary>Plant Data Structure</summary>
              <pre>{JSON.stringify(actualPlantData, null, 2)}</pre>
            </details>
          )}
        </div>
      )}
      
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
                {metrics.map((metric, index) => {
                  const value = getMetricValue(metric);
                  return (
                    <div key={index} className={`metric-card ${value === 'N/A' || value === 'Error' ? 'no-data' : ''}`}>
                      <div className="metric-header">
                        <span className="metric-name">{metric}</span>
                      </div>
                      <div className="metric-value-container">
                        <span className="metric-value">{value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default DataDisplay;