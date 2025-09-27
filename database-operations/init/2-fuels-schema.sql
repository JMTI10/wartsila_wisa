-- Fuels SQL Schema
-- Database schema for power plant fuel consumption tracking

-- Main fuels table with basic properties
CREATE TABLE fuels (
    fuel_id SERIAL PRIMARY KEY,
    fuel_name VARCHAR(50) NOT NULL UNIQUE,
    fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('solid', 'liquid', 'gas')),
    density DECIMAL(10,4), -- kg/m³ for gases, kg/L for liquids, not applicable for solids
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fuel properties table for chemical composition and heating values
CREATE TABLE fuel_properties (
    property_id SERIAL PRIMARY KEY,
    fuel_id INTEGER REFERENCES fuels(fuel_id) ON DELETE CASCADE,
    heating_value DECIMAL(10,3) NOT NULL, -- MJ/kg for solids, MJ/L for liquids, MJ/m³ for gases
    heating_value_unit VARCHAR(10) NOT NULL CHECK (heating_value_unit IN ('MJ/kg', 'MJ/L', 'MJ/m³')),
    sulfur_content DECIMAL(5,2), -- percentage (%)
    ash_content DECIMAL(5,2), -- percentage (%) - applicable mainly for coal and biomass
    moisture_content DECIMAL(5,2), -- percentage (%) - applicable mainly for biomass
    carbon_content DECIMAL(5,2), -- percentage (%)
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Create indexes for performance
CREATE INDEX idx_fuel_properties_fuel ON fuel_properties(fuel_id);
CREATE INDEX idx_fuel_properties_date ON fuel_properties(effective_date);

