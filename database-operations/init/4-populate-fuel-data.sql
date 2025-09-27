-- Fuel Database Dummy Data Population
-- Populates the fuels and fuel_properties tables with realistic data

-- Insert fuel types
INSERT INTO fuels (fuel_name, fuel_type, density) VALUES
('coal', 'solid', NULL),                    -- Solid fuels don't have density in kg/m³
('natural gas', 'gas', 0.717),              -- kg/m³ at standard conditions
('oil', 'liquid', 0.850),                   -- kg/L (typical fuel oil)
('biomass', 'solid', NULL),                 -- Solid fuel
('methanol', 'liquid', 0.792),              -- kg/L
('methane', 'gas', 0.656),                  -- kg/m³ at standard conditions
('ammonia', 'gas', 0.696),                  -- kg/m³ at standard conditions
('hydrogen', 'gas', 0.082);                 -- kg/m³ at standard conditions

-- Insert fuel properties with realistic values
-- Coal properties
INSERT INTO fuel_properties (fuel_id, heating_value, heating_value_unit, sulfur_content, ash_content, moisture_content, carbon_content) VALUES
(1, 25.5, 'MJ/kg', 1.2, 8.5, 6.0, 72.0);

-- Natural gas properties
INSERT INTO fuel_properties (fuel_id, heating_value, heating_value_unit, sulfur_content, ash_content, moisture_content, carbon_content) VALUES
(2, 38.7, 'MJ/m³', 0.0, 0.0, 0.0, 75.0);

-- Oil properties (fuel oil)
INSERT INTO fuel_properties (fuel_id, heating_value, heating_value_unit, sulfur_content, ash_content, moisture_content, carbon_content) VALUES
(3, 42.5, 'MJ/L', 0.5, 0.1, 0.2, 85.0);

-- Biomass properties (wood pellets)
INSERT INTO fuel_properties (fuel_id, heating_value, heating_value_unit, sulfur_content, ash_content, moisture_content, carbon_content) VALUES
(4, 17.8, 'MJ/kg', 0.02, 0.7, 8.0, 51.0);

-- Methanol properties
INSERT INTO fuel_properties (fuel_id, heating_value, heating_value_unit, sulfur_content, ash_content, moisture_content, carbon_content) VALUES
(5, 22.7, 'MJ/L', 0.0, 0.0, 0.0, 37.5);

-- Methane properties (pure)
INSERT INTO fuel_properties (fuel_id, heating_value, heating_value_unit, sulfur_content, ash_content, moisture_content, carbon_content) VALUES
(6, 35.8, 'MJ/m³', 0.0, 0.0, 0.0, 75.0);

-- Ammonia properties
INSERT INTO fuel_properties (fuel_id, heating_value, heating_value_unit, sulfur_content, ash_content, moisture_content, carbon_content) VALUES
(7, 18.6, 'MJ/m³', 0.0, 0.0, 0.0, 0.0);

-- Hydrogen properties
INSERT INTO fuel_properties (fuel_id, heating_value, heating_value_unit, sulfur_content, ash_content, moisture_content, carbon_content) VALUES
(8, 10.8, 'MJ/m³', 0.0, 0.0, 0.0, 0.0);

-- Verify the data insertion
SELECT 
    f.fuel_name,
    f.fuel_type,
    f.density,
    fp.heating_value,
    fp.heating_value_unit,
    fp.sulfur_content,
    fp.ash_content,
    fp.moisture_content,
    fp.carbon_content
FROM fuels f
JOIN fuel_properties fp ON f.fuel_id = fp.fuel_id
ORDER BY f.fuel_id;