-- =============================================================================
-- WÄRTSILÄ METRICS DATABASE - MINIMAL SCHEMA (PostgreSQL)
-- File: database-metrics/init/01-schema.sql
-- =============================================================================

-- Note: Database is already created by docker-compose environment variables
-- No need for CREATE DATABASE or USE statements

-- Connection test table
CREATE TABLE connection_test_metrics (
    id SERIAL PRIMARY KEY,
    test_message VARCHAR(255) DEFAULT 'Metrics DB Connection Successful',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Simple metrics table
CREATE TABLE plant_metrics (
    id BIGSERIAL PRIMARY KEY,
    plant_id VARCHAR(50) NOT NULL,
    carbon_intensity DECIMAL(10, 2), -- gCO2/kWh
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test data for connection_test_metrics
INSERT INTO connection_test_metrics (test_message) VALUES
('Metrics DB Connection Test 1'),
('Metrics DB Connection Test 2')
ON CONFLICT DO NOTHING;

-- Insert some test metrics data
INSERT INTO plant_metrics (plant_id, carbon_intensity) VALUES
('PLANT_001', 420.50),
('PLANT_002', 385.75),
('PLANT_003', 445.20),
('PLANT_001', 415.30),
('PLANT_002', 390.10)
ON CONFLICT DO NOTHING;