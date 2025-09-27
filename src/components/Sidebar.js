import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar-component">
      <div className="sidebar-header">
        <h2>Controls & Filters</h2>
      </div>
      
      <div className="sidebar-content">
        <div className="sidebar-section">
          <h3>Chart Settings</h3>
          <div className="sidebar-item">
            <label>Time Range</label>
            <select>
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;