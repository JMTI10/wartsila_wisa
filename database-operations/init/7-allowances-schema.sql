-- =====================================================
-- EU ETS ALLOWANCE TRACKING TABLE
-- =====================================================

CREATE TABLE allowance_tracking (
    id BIGSERIAL PRIMARY KEY,
    
    -- Plant connection
    plant_id VARCHAR(50) NOT NULL REFERENCES plants(plant_id),
    
    -- Allocation period
    allocation_year INTEGER NOT NULL,
    
    -- Maximum allowances available
    total_allowances_available BIGINT NOT NULL, -- total allowances (free + purchased)
    
    -- Last updated
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(plant_id, allocation_year)
);

-- Index for performance
CREATE INDEX idx_allowance_tracking_plant_year ON allowance_tracking(plant_id, allocation_year);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

INSERT INTO allowance_tracking (
    plant_id,
    allocation_year,
    total_allowances_available
) VALUES (
    'PP-001', -- plant_id from plants table
    2025,
    1740000  -- 1.56M free + 0.18M purchased
)