-- =============================================================================
-- WÄRTSILÄ OPERATIONS DATABASE - DUMMY DATA MIGRATION (PostgreSQL)
-- File: database-operations/migrations/002-populate-dummy-data.sql
-- =============================================================================

-- Insert fuel types
INSERT INTO fuel_types (fuel_code, fuel_name) VALUES
('HFO', 'Heavy Fuel Oil'),
('LNG', 'Liquefied Natural Gas'),
('MDO', 'Marine Diesel Oil'),
('BIO', 'Biodiesel'),
('H2', 'Hydrogen');

-- Insert plants
INSERT INTO plants (plant_id, plant_name) VALUES
('FI-VAA-001', 'Vaasa Power Plant'),
('NO-OSL-002', 'Oslo Maritime Terminal'),
('SE-GOT-003', 'Gothenburg Industrial Complex'),
('DK-CPH-004', 'Copenhagen Energy Hub'),
('DE-HAM-005', 'Hamburg Port Facility');

-- Insert engines (using plant IDs from the plants we just created)
INSERT INTO engines (engine_id, engine_name, plant_id, fuel_code) VALUES
-- Vaasa Power Plant engines
('ENG-VAA-001', 'Vaasa Main Generator 1', (SELECT id FROM plants WHERE plant_id = 'FI-VAA-001'), 'HFO'),
('ENG-VAA-002', 'Vaasa Main Generator 2', (SELECT id FROM plants WHERE plant_id = 'FI-VAA-001'), 'HFO'),
('ENG-VAA-003', 'Vaasa Backup Unit', (SELECT id FROM plants WHERE plant_id = 'FI-VAA-001'), 'MDO'),

-- Oslo Maritime Terminal engines
('ENG-OSL-001', 'Oslo Terminal Engine A', (SELECT id FROM plants WHERE plant_id = 'NO-OSL-002'), 'LNG'),
('ENG-OSL-002', 'Oslo Terminal Engine B', (SELECT id FROM plants WHERE plant_id = 'NO-OSL-002'), 'LNG'),

-- Gothenburg Industrial Complex engines
('ENG-GOT-001', 'Gothenburg Industrial Unit 1', (SELECT id FROM plants WHERE plant_id = 'SE-GOT-003'), 'BIO'),
('ENG-GOT-002', 'Gothenburg Industrial Unit 2', (SELECT id FROM plants WHERE plant_id = 'SE-GOT-003'), 'BIO'),
('ENG-GOT-003', 'Gothenburg Emergency Backup', (SELECT id FROM plants WHERE plant_id = 'SE-GOT-003'), 'MDO'),

-- Copenhagen Energy Hub engines
('ENG-CPH-001', 'Copenhagen Hub Primary', (SELECT id FROM plants WHERE plant_id = 'DK-CPH-004'), 'H2'),
('ENG-CPH-002', 'Copenhagen Hub Secondary', (SELECT id FROM plants WHERE plant_id = 'DK-CPH-004'), 'LNG'),

-- Hamburg Port Facility engines
('ENG-HAM-001', 'Hamburg Port Engine 1', (SELECT id FROM plants WHERE plant_id = 'DE-HAM-005'), 'HFO'),
('ENG-HAM-002', 'Hamburg Port Engine 2', (SELECT id FROM plants WHERE plant_id = 'DE-HAM-005'), 'HFO'),
('ENG-HAM-003', 'Hamburg Port Engine 3', (SELECT id FROM plants WHERE plant_id = 'DE-HAM-005'), 'MDO');

-- Insert connection test record
INSERT INTO connection_test_operations (test_message) VALUES 
('Dummy data populated successfully');

-- =============================================================================
-- Verification queries (commented out - uncomment to test after migration)
-- =============================================================================

/*
-- Verify data insertion
SELECT 'Fuel Types Count' as table_name, COUNT(*) as record_count FROM fuel_types
UNION ALL
SELECT 'Plants Count', COUNT(*) FROM plants
UNION ALL
SELECT 'Engines Count', COUNT(*) FROM engines;

-- View engines with their plant and fuel information
SELECT 
    e.engine_id,
    e.engine_name,
    p.plant_name,
    f.fuel_name
FROM engines e
JOIN plants p ON e.plant_id = p.id
JOIN fuel_types f ON e.fuel_code = f.fuel_code
ORDER BY p.plant_name, e.engine_id;

-- View engines per plant summary
SELECT 
    p.plant_name,
    COUNT(e.id) as engine_count,
    STRING_AGG(DISTINCT f.fuel_name, ', ' ORDER BY f.fuel_name) as fuel_types_used
FROM plants p
LEFT JOIN engines e ON p.id = e.plant_id
LEFT JOIN fuel_types f ON e.fuel_code = f.fuel_code
GROUP BY p.id, p.plant_name
ORDER BY p.plant_name;
*/