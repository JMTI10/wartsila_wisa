-- Power Plant Engine SQL Schema
-- Database schema for power plant engine operations, generation, and emissions tracking

-- Main engines table
CREATE TABLE engines (
    engine_id SERIAL PRIMARY KEY,
    plant_id VARCHAR(50) NOT NULL, -- Reference to plant identifier
    model VARCHAR(100),
    nameplate_capacity DECIMAL(10,3), -- MW
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'decommissioned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Engine fuel consumption records
CREATE TABLE engine_fuel_consumption (
    consumption_id SERIAL PRIMARY KEY,
    engine_id INTEGER REFERENCES engines(engine_id) ON DELETE CASCADE,
    fuel_id INTEGER NOT NULL, -- References fuels table from previous schema
    measurement_date DATE NOT NULL,
    consumption_rate DECIMAL(12,3) NOT NULL, -- hourly consumption rate
    consumption_rate_unit VARCHAR(15) NOT NULL,
    annual_consumption DECIMAL(15,3), -- total annual consumption
    fuel_cost_per_day DECIMAL(12,2), -- daily fuel cost in currency units
    annual_consumption_unit VARCHAR(15),
    fuel_energy_input DECIMAL(10,3), -- MW - fuel energy input rate
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_consumption_rate CHECK (consumption_rate >= 0),
    CONSTRAINT valid_annual_consumption CHECK (annual_consumption IS NULL OR annual_consumption >= 0),
    CONSTRAINT valid_fuel_cost_per_day CHECK (fuel_cost_per_day IS NULL OR fuel_cost_per_day >= 0)
);

-- Engine generation records
CREATE TABLE engine_generation (
    generation_id SERIAL PRIMARY KEY,
    engine_id INTEGER REFERENCES engines(engine_id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL,
    gross_generation DECIMAL(12,3), -- MWh/year
    net_generation DECIMAL(12,3), -- MWh/year
    auxiliary_power DECIMAL(12,3), -- MWh/year
    operating_hours DECIMAL(8,2), -- hours/year
    capacity_factor DECIMAL(5,2), -- percentage
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_gross_generation CHECK (gross_generation IS NULL OR gross_generation >= 0),
    CONSTRAINT valid_net_generation CHECK (net_generation IS NULL OR net_generation >= 0),
    CONSTRAINT valid_auxiliary_power CHECK (auxiliary_power IS NULL OR auxiliary_power >= 0),
    CONSTRAINT valid_operating_hours CHECK (operating_hours IS NULL OR operating_hours >= 0),
    CONSTRAINT valid_capacity_factor CHECK (capacity_factor IS NULL OR (capacity_factor >= 0 AND capacity_factor <= 100))
);

-- Stack emissions table for major greenhouse gases and pollutants
CREATE TABLE engine_stack_emissions (
    emission_id SERIAL PRIMARY KEY,
    engine_id INTEGER REFERENCES engines(engine_id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL,
    pollutant_type VARCHAR(30) NOT NULL CHECK (pollutant_type IN ('co2', 'ch4', 'n2o', 'nox', 'sox')),
    concentration DECIMAL(10,3), -- ppm
    mass_rate DECIMAL(12,3), -- kg/hour
    annual_total DECIMAL(15,3), -- tonnes/year
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_concentration CHECK (concentration IS NULL OR concentration >= 0),
    CONSTRAINT valid_mass_rate CHECK (mass_rate IS NULL OR mass_rate >= 0),
    CONSTRAINT valid_annual_total CHECK (annual_total IS NULL OR annual_total >= 0),
    
    UNIQUE(engine_id, measurement_date, pollutant_type)
);

-- Particulate matter emissions table
CREATE TABLE engine_particulate_emissions (
    particulate_id SERIAL PRIMARY KEY,
    engine_id INTEGER REFERENCES engines(engine_id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL,
    pm10_rate DECIMAL(10,3), -- kg/hour
    pm25_rate DECIMAL(10,3), -- kg/hour
    total_pm_annual DECIMAL(12,3), -- tonnes/year
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_pm10_rate CHECK (pm10_rate IS NULL OR pm10_rate >= 0),
    CONSTRAINT valid_pm25_rate CHECK (pm25_rate IS NULL OR pm25_rate >= 0),
    CONSTRAINT valid_total_pm_annual CHECK (total_pm_annual IS NULL OR total_pm_annual >= 0),
    
    UNIQUE(engine_id, measurement_date)
);

-- Other pollutants emissions table
CREATE TABLE engine_other_emissions (
    other_emission_id SERIAL PRIMARY KEY,
    engine_id INTEGER REFERENCES engines(engine_id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL,
    pollutant_type VARCHAR(30) NOT NULL CHECK (pollutant_type IN ('mercury', 'heavy_metals', 'vocs')),
    annual_total DECIMAL(12,3) NOT NULL, -- kg/year
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_other_annual_total CHECK (annual_total >= 0),
    
    UNIQUE(engine_id, measurement_date, pollutant_type)
);

-- Create indexes for performance (foreign keys only)
CREATE INDEX idx_fuel_consumption_engine ON engine_fuel_consumption(engine_id);
CREATE INDEX idx_fuel_consumption_fuel ON engine_fuel_consumption(fuel_id);
CREATE INDEX idx_generation_engine ON engine_generation(engine_id);
CREATE INDEX idx_stack_emissions_engine ON engine_stack_emissions(engine_id);
CREATE INDEX idx_particulate_emissions_engine ON engine_particulate_emissions(engine_id);
CREATE INDEX idx_other_emissions_engine ON engine_other_emissions(engine_id);

-- Add constraints for fuel consumption units validation
ALTER TABLE engine_fuel_consumption ADD CONSTRAINT valid_fuel_consumption_units 
CHECK (
    (consumption_rate_unit IN ('tonnes/hour', 'tonnes/year') AND fuel_id IN (1, 4, 7)) OR  -- coal, biomass, ammonia
    (consumption_rate_unit IN ('m³/hour', 'm³/year') AND fuel_id IN (2, 6)) OR             -- natural_gas, methane
    (consumption_rate_unit IN ('liters/hour', 'liters/year') AND fuel_id IN (3, 5)) OR     -- oil, methanol
    (consumption_rate_unit IN ('kg/hour', 'kg/year') AND fuel_id = 8)                      -- hydrogen
);

-- Add trigger functions and triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_engines_updated_at 
    BEFORE UPDATE ON engines 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_engine_fuel_consumption_updated_at 
    BEFORE UPDATE ON engine_fuel_consumption 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_engine_generation_updated_at 
    BEFORE UPDATE ON engine_generation 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_engine_stack_emissions_updated_at 
    BEFORE UPDATE ON engine_stack_emissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_engine_particulate_emissions_updated_at 
    BEFORE UPDATE ON engine_particulate_emissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_engine_other_emissions_updated_at 
    BEFORE UPDATE ON engine_other_emissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();