-- =============================================================================
-- WÄRTSILÄ OPERATIONS DATABASE - SCHEMA ONLY (PostgreSQL)
-- File: database-operations/init/01-schema.sql
-- =============================================================================

-- Connection test table
CREATE TABLE connection_test_operations (
    id SERIAL PRIMARY KEY,
    test_message VARCHAR(255) DEFAULT 'Operations DB Connection Successful',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plants table
CREATE TABLE plants (
    id BIGSERIAL PRIMARY KEY,
    plant_id VARCHAR(50) NOT NULL UNIQUE,
    plant_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fuel types table
CREATE TABLE fuel_types (
    id BIGSERIAL PRIMARY KEY,
    fuel_code VARCHAR(20) NOT NULL UNIQUE,
    fuel_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Engines table
CREATE TABLE engines (
    id BIGSERIAL PRIMARY KEY,
    engine_id VARCHAR(50) NOT NULL UNIQUE,
    engine_name VARCHAR(100) NOT NULL,
    plant_id BIGINT NOT NULL,
    fuel_code VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_engines_plant FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
    CONSTRAINT fk_engines_fuel FOREIGN KEY (fuel_code) REFERENCES fuel_types(fuel_code)
);

-- Indexes for better performance
CREATE INDEX idx_plants_plant_id ON plants(plant_id);
CREATE INDEX idx_engines_engine_id ON engines(engine_id);
CREATE INDEX idx_engines_plant_id ON engines(plant_id);
CREATE INDEX idx_engines_fuel_code ON engines(fuel_code);
CREATE INDEX idx_fuel_types_fuel_code ON fuel_types(fuel_code);

-- Insert initial connection test record
INSERT INTO connection_test_operations (test_message) VALUES 
('Schema initialization completed');