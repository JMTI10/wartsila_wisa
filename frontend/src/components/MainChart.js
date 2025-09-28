import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainChart.css';

const MainChart = ({ selectedMetrics = [], plantData, currentPlant }) => {
  const navigate = useNavigate();

  // Extract the actual plant data from the combined data structure
  const actualPlantData = plantData?.overview;
  const loading = plantData?.loading;
  const error = plantData?.error;
  console.log(plantData)

  const handleEngineClick = () => {
    navigate('/engine');
  };

  if (loading) {
    return (
      <div className="main-chart">
        <div className="chart-loading">
          <div className="spinner"></div>
          <p>Loading plant data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-chart">
        <div className="chart-error">
          <p>Error loading plant data: {error}</p>
        </div>
      </div>
    );
  }

  if (!actualPlantData) {
    return (
      <div className="main-chart">
        <div className="chart-error">
          <p>No plant data available</p>
        </div>
      </div>
    );
  }

  // Helper function to get metric values
  const getMetricValue = (metricName) => {
    if (!actualPlantData) return "N/A";
    
    try {
      // Plant & Engine Overview
      if (metricName === "Plant ID") return actualPlantData.plant_id;
      if (metricName === "Plant Name") return actualPlantData.plant_name;
      if (metricName === "Total Engines Count") return actualPlantData.engines?.total_count;
      if (metricName === "Active Engines Count") return actualPlantData.engines?.active_count;
      if (metricName === "Engines in Maintenance") return actualPlantData.engines?.maintenance_count;
      if (metricName === "Total Nameplate Capacity (MW)") return actualPlantData.engines?.total_nameplate_capacity;
      if (metricName === "Engine Models") return actualPlantData.engines?.engines_list?.map(engine => engine.model).join(", ");
      if (metricName === "Engine Status") return `${actualPlantData.engines?.active_count || 0} active, ${actualPlantData.engines?.maintenance_count || 0} maintenance`;

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
      
      return "N/A";
    } catch (error) {
      return "Error";
    }
  };

  // Render charts only if specific metrics are selected
  const renderEngineCapacityChart = () => {
    const engineMetrics = ["Total Engines Count", "Active Engines Count", "Engines in Maintenance", "Total Nameplate Capacity (MW)", "Engine Models", "Engine Status"];
    const hasEngineMetrics = selectedMetrics.some(metric => engineMetrics.includes(metric));
    
    if (!hasEngineMetrics || !actualPlantData.engines?.engines_list) return null;

    return (
      <div className="chart-container">
        <h3>Engine Capacity Distribution</h3>
        <div className="bar-chart">
          {actualPlantData.engines.engines_list.map((engine, index) => (
            <div key={engine.engine_id} className="bar-item">
              <div className="bar-label">{engine.model}</div>
              <div className="bar-track">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${(parseFloat(engine.nameplate_capacity) / actualPlantData.engines.total_nameplate_capacity) * 100}%`,
                    backgroundColor: engine.status === 'active' ? '#27ae60' : '#e74c3c'
                  }}
                >
                  <span className="bar-value">{engine.nameplate_capacity} MW</span>
                </div>
              </div>
              <div className={`bar-status ${engine.status}`}>
                {engine.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEnergyProductionChart = () => {
    const energyMetrics = ["Total Gross Generation (MWh)", "Total Net Generation (MWh)", "Total Auxiliary Power (MWh)", "Average Capacity Factor (%)"];
    const hasEnergyMetrics = selectedMetrics.some(metric => energyMetrics.includes(metric));
    
    if (!hasEnergyMetrics || !actualPlantData.energy_totals) return null;

    const energyData = [
      { label: 'Gross Generation', value: actualPlantData.energy_totals.total_gross_generation, color: '#3498db' },
      { label: 'Net Generation', value: actualPlantData.energy_totals.total_net_generation, color: '#2ecc71' },
      { label: 'Auxiliary Power', value: actualPlantData.energy_totals.total_auxiliary_power, color: '#e74c3c' }
    ];

    const maxValue = Math.max(...energyData.map(d => d.value));

    return (
      <div className="chart-container">
        <h3>Energy Production (MWh)</h3>
        <div className="bar-chart vertical">
          {energyData.map((item, index) => (
            <div key={item.label} className="bar-item vertical">
              <div className="bar-label">{item.label}</div>
              <div className="bar-track">
                <div 
                  className="bar-fill"
                  style={{ 
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color
                  }}
                >
                  <span className="bar-value">{(item.value / 1000).toLocaleString()}k</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCarbonEmissionsChart = () => {
    const carbonMetrics = ["Total CO2 Emissions (tons)", "CO2 Equivalent Total (tons)"];
    const hasCarbonMetrics = selectedMetrics.some(metric => carbonMetrics.includes(metric));
    
    if (!hasCarbonMetrics || !actualPlantData.carbon_emissions) return null;

    const carbonData = [
      { label: 'Total CO2', value: actualPlantData.carbon_emissions.total_co2_all_time, color: '#34495e' },
      { label: 'CO2 Equivalent', value: actualPlantData.carbon_emissions.co2_equivalent_total, color: '#2c3e50' }
    ];

    const maxValue = Math.max(...carbonData.map(d => d.value));

    return (
      <div className="chart-container">
        <h3>Carbon Emissions (tons)</h3>
        <div className="bar-chart vertical">
          {carbonData.map((item, index) => (
            <div key={item.label} className="bar-item vertical">
              <div className="bar-label">{item.label}</div>
              <div className="bar-track">
                <div 
                  className="bar-fill"
                  style={{ 
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color
                  }}
                >
                  <span className="bar-value">{Math.round(item.value / 1000).toLocaleString()}k</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Only show charts if there are selected metrics that match
  const hasRelevantCharts = 
    renderEngineCapacityChart() || 
    renderEnergyProductionChart() || 
    renderCarbonEmissionsChart();

  return (
    <div className="main-chart">
      {/* Blue Header with Orange Button */}
      <div className="main-header">
        <div className="header-content">
          <div className="header-left">
            <h1>K+||-</h1>
            <p>Plant Performance Dashboard</p>
          </div>
          <div className="header-right">
            <button className="engine-button" onClick={handleEngineClick}>
              <span className="button-icon">⚙️</span>
              Engine Details
            </button>
          </div>
        </div>
      </div>

      <div className="chart-header">
        <h2>{actualPlantData.plant_name} - Overview</h2>
        <div className="chart-subtitle">
          <span>Plant ID: {actualPlantData.plant_id}</span>
          <span>Current Plant: {currentPlant}</span>
          <span>Last Updated: {actualPlantData.last_updated ? new Date(actualPlantData.last_updated).toLocaleString() : 'N/A'}</span>
          <span>Selected Metrics: {selectedMetrics.length}</span>
        </div>
      </div>

      {/* Show message if no relevant metrics selected */}
      {selectedMetrics.length === 0 && (
        <div className="no-metrics-message">
          <p>Select metrics from the sidebar to display charts and data</p>
        </div>
      )}

      {selectedMetrics.length > 0 && !hasRelevantCharts && (
        <div className="no-charts-message">
          <p>Selected metrics will be displayed in the Data Display section below</p>
        </div>
      )}

      {/* Charts Grid - Only show if there are relevant charts */}
      {hasRelevantCharts && (
        <div className="charts-grid">
          <div className="chart-row">
            {renderEngineCapacityChart()}
            {renderEnergyProductionChart()}
          </div>
          
          <div className="chart-row">
            {renderCarbonEmissionsChart()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainChart;