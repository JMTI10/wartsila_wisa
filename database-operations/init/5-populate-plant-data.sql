-- Power Plants Dummy Data Population
-- Populates the plants table with 3 realistic power plant entries

INSERT INTO plants (plant_id, plant_name) VALUES
('PP-001', 'Riverside Coal Power Station'),
('PP-002', 'Harbor Natural Gas Plant'),
('PP-003', 'Greenfield Combined Cycle Facility');

-- Verify the data insertion
SELECT 
    id,
    plant_id,
    plant_name,
    created_at
FROM plants
ORDER BY id;