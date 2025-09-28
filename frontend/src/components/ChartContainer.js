import React from 'react';
import PropTypes from 'prop-types';
import './ChartContainer.css';

const ChartContainer = ({ title, chartId, small = false, children, className = '', ...rest }) => {
  return (
    <div 
      className={`chart-container ${small ? 'chart-small' : ''} ${className}`} 
      id={chartId}
      role="figure"
      aria-label={`${title} chart`}
      {...rest}
    >
      <div className="chart-header">
        <h3>{title}</h3>
      </div>
      <div className="chart-content">
        {children ? (
          children
        ) : (
          <div className="chart-placeholder">
            <p>No data available for {title}</p>
            <div className="placeholder-chart">
              <svg 
                width="100%" 
                height={small ? "120" : "200"} 
                viewBox="0 0 400 200"
                role="img"
                aria-label={`Placeholder chart for ${title}`}
              >
                <rect width="400" height="200" fill="#f3f4f6" />
                <path 
                  d="M50,150 L100,100 L150,120 L200,80 L250,130 L300,70 L350,140" 
                  stroke="#2563eb" 
                  strokeWidth="2" 
                  fill="none"
                />
                {small && (
                  <text 
                    x="200" 
                    y="190" 
                    textAnchor="middle" 
                    fill="#6b7280" 
                    fontSize="12"
                  >
                    Small Chart - {title}
                  </text>
                )}
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ChartContainer.propTypes = {
  title: PropTypes.string.isRequired,
  chartId: PropTypes.string,
  small: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};

ChartContainer.defaultProps = {
  small: false,
  className: '',
  chartId: undefined,
  children: null,
};

export default ChartContainer;