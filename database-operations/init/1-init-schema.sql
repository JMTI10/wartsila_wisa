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

-- Indexes for better performance
CREATE INDEX idx_plants_plant_id ON plants(plant_id);

-- Insert initial connection test record
INSERT INTO connection_test_operations (test_message) VALUES 
('Schema initialization completed');