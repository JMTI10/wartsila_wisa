import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ChartContainer from './ChartContainer';
import './Engine.css';

const Engine = () => {
  const [engineData, setEngineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentEngineId, setCurrentEngineId] = useState(1);
  const availableEngines = [1, 2, 3];

  // Fetch engine data from the specified API endpoint
  const fetchEngineData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:3001/api/operations/engines/${currentEngineId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Invalid data received from API');
      }

      console.debug('API Response:', data); // Debug logging to inspect API response
      setEngineData(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching engine data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentEngineId]);

  useEffect(() => {
    fetchEngineData();
  }, [fetchEngineData]);

  const handleEngineChange = useCallback((engineId) => {
    if (engineId !== currentEngineId) {
      setCurrentEngineId(engineId);
    }
  }, [currentEngineId]);

  // Prepare chart data for the last 7 days
  const prepareChartData = useCallback(() => {
    if (!engineData?.emissions_daily_data?.length) {
      console.debug('No emissions_daily_data available');
      return null;
    }

    const dailyData = engineData.emissions_daily_data.slice(0, 7);
    
    return {
      labels: dailyData.map(item => item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'),
      co2Emissions: dailyData.map(item => Number(item.co2_emissions_calculated) || 0),
      netGeneration: dailyData.map(item => Number(item.net_generation_calculated) || 0),
      co2Intensity: dailyData.map(item => Number(item.co2_intensity_calculated) || 0)
    };
  }, [engineData]);

  const chartData = prepareChartData();

  const renderHeader = () => (
    <div className="main-chart-header" role="banner">
      <div className="header-left">
        <div className="header-brand">
          <h1>K+||-</h1>
        </div>
        <p className="header-subtitle">
          Engine Monitoring & Performance {engineData ? `- ${engineData.general_info?.model || ''}` : ''}
        </p>
        <div className="engine-selector" role="navigation">
          <span className="selector-label">Select Engine:</span>
          {availableEngines.map(engineId => (
            <button
              key={engineId}
              className={`engine-btn ${currentEngineId === engineId ? 'active' : ''}`}
              onClick={() => handleEngineChange(engineId)}
              aria-pressed={currentEngineId === engineId}
              aria-label={`Select Engine ${engineId}`}
            >
              Engine {engineId}
            </button>
          ))}
        </div>
      </div>
      <div className="header-right">
        <Link to="/" className="engine-link" aria-label="Return to Dashboard">
          <span className="engine-icon" aria-hidden="true">←</span>
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="engine-page">
      {renderHeader()}
      <div className="loading-container" role="alert">
        <div className="loading-spinner" aria-hidden="true"></div>
        <p>Loading engine {currentEngineId} data...</p>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="engine-page">
      {renderHeader()}
      <div className="error-container" role="alert">
        <h3>Error loading engine data</h3>
        <p>{error}</p>
        <button 
          onClick={() => fetchEngineData()} 
          className="retry-button"
          aria-label="Retry loading engine data"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const renderNoData = () => (
    <div className="engine-page">
      {renderHeader()}
      <div className="error-container" role="alert">
        <h3>No data available</h3>
        <p>Unable to load engine information for Engine {currentEngineId}</p>
      </div>
    </div>
  );

  if (loading) return renderLoading();
  if (error) return renderError();
  if (!engineData || !engineData.general_info) return renderNoData();

  return (
    <div className="engine-page">
      {renderHeader()}
      
      <div className="engine-main-container">
        <section className="engine-section name-id-section" aria-labelledby="general-info-heading">
          <h2 id="general-info-heading">General Information</h2>
          <div className="section-content">
            {[
              { label: 'Engine ID', value: engineData.general_info?.engine_id },
              { label: 'Plant ID', value: engineData.general_info?.plant_id },
              { label: 'Model', value: engineData.general_info?.model },
              { label: 'Capacity', value: engineData.general_info?.nameplate_capacity ? `${engineData.general_info.nameplate_capacity} MW` : 'N/A' },
              { label: 'Status', value: engineData.general_info?.status, className: `status-${engineData.general_info?.status?.toLowerCase()}` }
            ].map((item, index) => (
              <div key={index} className="data-item">
                <label>{item.label}:</label>
                <span className={`value ${item.className || ''}`}>
                  {item.value || 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="engine-section efficiency-section" aria-labelledby="efficiency-heading">
          <h2 id="efficiency-heading">Efficiency Metrics</h2>
          <div className="section-content">
            {engineData.efficiency_metrics ? (
              [
                { label: 'Heat Rate', value: engineData.efficiency_metrics.heat_rate_calculated, unit: engineData.efficiency_metrics.heat_rate_unit },
                { label: 'Thermal Efficiency', value: engineData.efficiency_metrics.thermal_efficiency_calculated, unit: engineData.efficiency_metrics.thermal_efficiency_unit },
                { label: 'Capacity Factor', value: engineData.yearly_data?.[0]?.capacity_factor_annual_calculated, unit: '%' },
                { label: 'Operating Hours', value: engineData.yearly_data?.[0]?.operating_hours_annual_calculated, unit: 'hours', format: 'toLocaleString' },
                { label: 'Total Generation', value: engineData.yearly_data?.[0]?.net_generation_annual_calculated, unit: 'MWh', format: 'toLocaleString' }
              ].map((item, index) => (
                <div key={index} className="data-item">
                  <label>{item.label}:</label>
                  <span className="value">
                    {item.value != null ? 
                      `${item.format === 'toLocaleString' ? Number(item.value).toLocaleString() : item.value} ${item.unit || ''}` : 
                      'N/A'
                    }
                  </span>
                </div>
              ))
            ) : (
              <div className="no-data-message">
                <p>No efficiency metrics available</p>
              </div>
            )}
          </div>
        </section>

        <section className="engine-section cost-carbon-section" aria-labelledby="emissions-intensity-heading">
          <h2 id="emissions-intensity-heading">Emissions Intensity</h2>
          <div className="section-content">
            {engineData.emissions_metrics?.co2_intensity_calculated != null ? (
              <div className="data-item">
                <label>CO2 Intensity:</label>
                <span className="value">
                  {`${engineData.emissions_metrics.co2_intensity_calculated} ${engineData.emissions_metrics.co2_intensity_calculated_unit || ''}`}
                </span>
              </div>
            ) : (
              <div className="no-data-message">
                <p>No emissions intensity data available</p>
              </div>
            )}
          </div>
        </section>

        <section className="engine-section emissions-section" aria-labelledby="emissions-rates-heading">
          <h2 id="emissions-rates-heading">Emission Rates</h2>
          <div className="section-content">
            {engineData.emissions_metrics?.emission_rates ? (
              [
                { label: 'CO2 Rate', value: engineData.emissions_metrics.emission_rates.co2_rate, unit: engineData.emissions_metrics.emission_rates.co2_rate_unit, format: 'toLocaleString' },
                { label: 'NOx Rate', value: engineData.emissions_metrics.emission_rates.nox_rate, unit: engineData.emissions_metrics.emission_rates.nox_rate_unit },
                { label: 'SOx Rate', value: engineData.emissions_metrics.emission_rates.sox_rate, unit: engineData.emissions_metrics.emission_rates.sox_rate_unit }
              ].map((item, index) => (
                <div key={index} className="data-item">
                  <label>{item.label}:</label>
                  <span className="value">
                    {item.value != null ? 
                      `${item.format === 'toLocaleString' ? Number(item.value).toLocaleString() : item.value} ${item.unit || ''}` : 
                      'N/A'
                    }
                  </span>
                </div>
              ))
            ) : (
              <div className="no-data-message">
                <p>No emission rates data available</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {chartData ? (
        <section className="charts-section" aria-labelledby="charts-heading">
          <h3 id="charts-heading">Daily Performance Metrics</h3>
          <div className="charts-container">
            <ChartContainer title="CO2 Emissions & Net Generation" chartId="co2-generation-chart">
              <div className="chart-wrapper">
                <div className="simple-bar-chart">
                  <div className="chart-bars-container">
                    {chartData.labels.map((label, index) => {
                      const maxCo2 = Math.max(...chartData.co2Emissions, 1);
                      const maxGeneration = Math.max(...chartData.netGeneration, 1);
                      const co2Height = (chartData.co2Emissions[index] / maxCo2) * 85;
                      const generationHeight = (chartData.netGeneration[index] / maxGeneration) * 85;

                      return (
                        <div key={index} className="chart-bar-group">
                          <div className="chart-bars-wrapper">
                            <div 
                              className="chart-bar co2-bar" 
                              style={{ height: `${co2Height}%` }}
                              role="img"
                              aria-label={`CO2 Emissions on ${label}: ${chartData.co2Emissions[index].toLocaleString()} kg`}
                            >
                              <span className="bar-value">
                                {chartData.co2Emissions[index] > 1000000 
                                  ? `${(chartData.co2Emissions[index] / 1000000).toFixed(1)}M`
                                  : chartData.co2Emissions[index] > 1000 
                                    ? `${(chartData.co2Emissions[index] / 1000).toFixed(0)}K`
                                    : Math.round(chartData.co2Emissions[index])
                                }
                              </span>
                            </div>
                            <div 
                              className="chart-bar generation-bar" 
                              style={{ height: `${generationHeight}%` }}
                              role="img"
                              aria-label={`Net Generation on ${label}: ${chartData.netGeneration[index].toLocaleString()} MWh`}
                            >
                              <span className="bar-value">{Math.round(chartData.netGeneration[index])}</span>
                            </div>
                          </div>
                          <div className="chart-label">{label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color co2-color" aria-hidden="true"></span>
                  <span>CO2 Emissions (kg)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color generation-color" aria-hidden="true"></span>
                  <span>Net Generation (MWh)</span>
                </div>
              </div>
            </ChartContainer>

            <ChartContainer title="CO2 Intensity Trend (kg/MWh)" chartId="co2-intensity-chart">
              <div className="chart-wrapper">
                <div className="co2-intensity-bars">
                  <div className="intensity-bars-container">
                    {chartData.co2Intensity.map((value, index) => {
                      const maxIntensity = Math.max(...chartData.co2Intensity, 1);
                      const minIntensity = Math.min(...chartData.co2Intensity, 0);
                      const intensityHeight = minIntensity === maxIntensity 
                        ? 50 
                        : 15 + ((value - minIntensity) / (maxIntensity - minIntensity)) * 70;

                      return (
                        <div key={index} className="intensity-bar-group">
                          <div 
                            className="intensity-bar" 
                            style={{ height: `${intensityHeight}%` }}
                            role="img"
                            aria-label={`CO2 Intensity on ${chartData.labels[index]}: ${value.toFixed(1)} kg/MWh`}
                          >
                            <span className="intensity-value">{Math.round(value)}</span>
                          </div>
                          <div className="intensity-label">{chartData.labels[index]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="chart-stats">
                <div className="stat-item">
                  <span>Min: </span>
                  <strong>{Math.min(...chartData.co2Intensity).toFixed(1)}</strong>
                </div>
                <div className="stat-item">
                  <span>Max: </span>
                  <strong>{Math.max(...chartData.co2Intensity).toFixed(1)}</strong>
                </div>
                <div className="stat-item">
                  <span>Avg: </span>
                  <strong>{(chartData.co2Intensity.reduce((a, b) => a + b, 0) / chartData.co2Intensity.length).toFixed(1)}</strong>
                </div>
              </div>
              <div className="intensity-scale">
                <span>kg/MWh</span>
              </div>
            </ChartContainer>
          </div>
        </section>
      ) : (
        <section className="charts-section" aria-labelledby="charts-heading">
          <h3 id="charts-heading">Daily Performance Metrics</h3>
          <div className="no-data-message">
            <p>No daily performance data available for Engine {currentEngineId}</p>
          </div>
        </section>
      )}
    </div>
  );
};

Engine.propTypes = {
  engineId: PropTypes.number
};

Engine.defaultProps = {
  engineId: 1
};

export default Engine;