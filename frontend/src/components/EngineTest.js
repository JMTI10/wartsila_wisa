import React, { useState, useEffect } from 'react';

// CSS styles embedded in the component
const styles = `
/* Sidebar.css */
.sidebar {
  width: 350px;
  height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-left: 3px solid #0066cc;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.sidebar-header {
  padding: 20px;
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
  color: white;
  border-bottom: 1px solid #003366;
  flex-shrink: 0;
}

.sidebar-header h2 {
  margin: 0 0 15px 0;
  font-size: 1.4rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.header-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.view-toggle {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.view-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.view-toggle.detailed {
  background: rgba(46, 204, 113, 0.3);
  border-color: rgba(46, 204, 113, 0.5);
}

.refresh-btn {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(180deg);
}

.engines-count {
  padding: 15px 20px;
  background: rgba(0, 102, 204, 0.08);
  border-bottom: 1px solid #e9ecef;
  flex-shrink: 0;
}

.engines-count p {
  margin: 0;
  color: #495057;
  font-size: 0.95rem;
}

.engines-count strong {
  color: #0066cc;
  font-weight: 600;
}

.engines-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  scrollbar-width: thin;
  scrollbar-color: #0066cc #f1f3f5;
}

.engines-list::-webkit-scrollbar {
  width: 6px;
}

.engines-list::-webkit-scrollbar-track {
  background: #f1f3f5;
  border-radius: 3px;
}

.engines-list::-webkit-scrollbar-thumb {
  background: #0066cc;
  border-radius: 3px;
}

.engines-list::-webkit-scrollbar-thumb:hover {
  background: #004499;
}

.engine-card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  margin-bottom: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid #0066cc;
}

.engine-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-left-color: #004499;
}

.engine-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.engine-id {
  margin: 0;
  color: #0066cc;
  font-size: 1.1rem;
  font-weight: 600;
  flex: 1;
}

.engine-name {
  color: #495057;
  font-size: 0.9rem;
  margin: 4px 0 0 0;
  font-weight: 500;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.status-badge.maintenance {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.engine-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f8f9fa;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  color: #6c757d;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-row .value {
  color: #495057;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: right;
  max-width: 60%;
  word-break: break-word;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #6c757d;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  padding: 20px;
  text-align: center;
  color: #dc3545;
}

.retry-btn {
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.retry-btn:hover {
  background: #c82333;
}

.no-engines {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.fuel-type-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.fuel-type-badge.diesel {
  background: #ffd6cc;
  color: #8b2500;
  border: 1px solid #ffab91;
}

.fuel-type-badge.gas {
  background: #e8f5e8;
  color: #2e7d32;
  border: 1px solid #a5d6a7;
}

.fuel-type-badge.lng {
  background: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid #ce93d8;
}

.fuel-type-badge.bio {
  background: #e8f5e8;
  color: #2e7d32;
  border: 1px solid #a5d6a7;
}

.fuel-type-badge.hybrid {
  background: #fff8e1;
  color: #f57f17;
  border: 1px solid #ffcc02;
}

.plant-info {
  background: rgba(0, 102, 204, 0.05);
  padding: 8px 12px;
  border-radius: 8px;
  margin: 8px 0;
}

.plant-info .plant-name {
  font-weight: 600;
  color: #0066cc;
  font-size: 0.9rem;
}

.plant-info .plant-id {
  color: #6c757d;
  font-size: 0.8rem;
  margin-top: 2px;
}

.date-info {
  color: #6c757d;
  font-size: 0.8rem;
  font-style: italic;
}
`;

// JavaScript - no TypeScript interfaces needed

const EngineTest = () => {
  const [engines, setEngines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('detailed');

  // Backend URL from Docker Compose - backend runs on port 3001
  const BACKEND_URL = 'http://localhost:3001';

  useEffect(() => {
    fetchEngines();
  }, []);

  const fetchEngines = async () => {
    try {
      setLoading(true);
      setError(null);

      // Always use detailed endpoint to get the EngineWithDetails data
      const endpoint = `${BACKEND_URL}/api/operations/engines/detailed`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Log the response to debug
      console.log('API Response:', data);

      // Check if data is an array, if not, try to extract the array from the response
      let engineArray = data;
      if (!Array.isArray(data)) {
        // Common API response structures
        if (data.data && Array.isArray(data.data)) {
          engineArray = data.data;
        } else if (data.engines && Array.isArray(data.engines)) {
          engineArray = data.engines;
        } else if (data.results && Array.isArray(data.results)) {
          engineArray = data.results;
        } else {
          throw new Error(
            'Response is not an array and no array found in common properties'
          );
        }
      }

      setEngines(engineArray);
    } catch (err) {
      console.error('Error fetching engines:', err);
      setError(
        `Failed to fetch engines: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchEngines();
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'basic' ? 'detailed' : 'basic'));
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getFuelTypeBadgeClass = (fuelCode) => {
    const lowerCode = fuelCode.toLowerCase();
    if (lowerCode.includes('diesel')) return 'diesel';
    if (lowerCode.includes('gas') || lowerCode.includes('ng')) return 'gas';
    if (lowerCode.includes('lng')) return 'lng';
    if (lowerCode.includes('bio')) return 'bio';
    if (lowerCode.includes('hybrid')) return 'hybrid';
    return 'diesel'; // default
  };

  // Inject styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (loading) {
    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>🚢 Engine Test Component</h2>
        </div>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading engines...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>🚢 Engine Test Component</h2>
        </div>
        <div className="error">
          <p>❌ {error}</p>
          <button onClick={handleRefresh} className="retry-btn">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🚢 Wärtsilä Engines</h2>
        <div className="header-controls">
          <button
            onClick={toggleViewMode}
            className={`view-toggle ${viewMode}`}
            title={`Switch to ${
              viewMode === 'basic' ? 'detailed' : 'basic'
            } view`}
          >
            {viewMode === 'basic' ? '📋 Basic' : '📊 Detailed'}
          </button>
          <button
            onClick={handleRefresh}
            className="refresh-btn"
            title="Refresh data"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="engines-count">
        <p>
          Total Engines: <strong>{engines.length}</strong>
        </p>
      </div>

      <div className="engines-list">
        {engines.length === 0 ? (
          <div className="no-engines">
            <p>No engines found</p>
          </div>
        ) : Array.isArray(engines) ? (
          engines.map((engine) => (
            <div key={engine.id} className="engine-card">
              <div className="engine-header">
                <div>
                  <h3 className="engine-id">🔧 {engine.engine_id}</h3>
                  <p className="engine-name">{engine.engine_name}</p>
                </div>
              </div>

              <div className="engine-details">
                <div className="detail-row">
                  <span className="label">Engine ID:</span>
                  <span className="value">#{engine.id}</span>
                </div>

                <div className="plant-info">
                  <div className="plant-name">{engine.plant_name}</div>
                  <div className="plant-id">Plant ID: {engine.plant_id}</div>
                </div>

                <div className="detail-row">
                  <span className="label">Fuel Type:</span>
                  <span
                    className={`fuel-type-badge ${getFuelTypeBadgeClass(
                      engine.fuel_code
                    )}`}
                  >
                    {engine.fuel_name}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="label">Fuel Code:</span>
                  <span className="value">{engine.fuel_code}</span>
                </div>

                {viewMode === 'detailed' && (
                  <>
                    <div className="detail-row">
                      <span className="label">Created:</span>
                      <span className="value date-info">
                        {formatDate(engine.created_at)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="error">
            <p>❌ Invalid data format received from API</p>
            <p>Expected array, got: {typeof engines}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EngineTest;
