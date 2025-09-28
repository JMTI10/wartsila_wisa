export interface Engine {
  engine_id: number; // SERIAL PRIMARY KEY
  plant_id: string; // VARCHAR(50) NOT NULL - Reference to plant identifier
  model?: string; // VARCHAR(100)
  nameplate_capacity?: number; // DECIMAL(10,3) - MW
  status: 'active' | 'inactive' | 'maintenance' | 'decommissioned'; // VARCHAR(20) with CHECK constraint
  created_at: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

// Additional interfaces for engine-related data from the schema

export interface EngineFuelConsumption {
  consumption_id: number; // SERIAL PRIMARY KEY
  engine_id: number; // References engines(engine_id)
  fuel_id: number; // References fuels table
  measurement_date: Date; // DATE NOT NULL
  consumption_rate: number; // DECIMAL(12,3) NOT NULL - hourly consumption rate
  consumption_rate_unit: string; // VARCHAR(15) NOT NULL
  annual_consumption?: number; // DECIMAL(15,3) - total annual consumption
  fuel_cost_per_day?: number; // DECIMAL(12,2) - daily fuel cost
  annual_consumption_unit?: string; // VARCHAR(15)
  fuel_energy_input?: number; // DECIMAL(10,3) - MW fuel energy input rate
  created_at: Date;
  updated_at: Date;
}

export interface EngineGeneration {
  generation_id: number; // SERIAL PRIMARY KEY
  engine_id: number; // References engines(engine_id)
  measurement_date: Date; // DATE NOT NULL
  gross_generation?: number; // DECIMAL(12,3) - MWh/year
  net_generation?: number; // DECIMAL(12,3) - MWh/year
  auxiliary_power?: number; // DECIMAL(12,3) - MWh/year
  operating_hours?: number; // DECIMAL(8,2) - hours/year
  capacity_factor?: number; // DECIMAL(5,2) - percentage
  created_at: Date;
  updated_at: Date;
}

export interface EngineStackEmissions {
  emission_id: number; // SERIAL PRIMARY KEY
  engine_id: number; // References engines(engine_id)
  measurement_date: Date; // DATE NOT NULL
  pollutant_type: 'co2' | 'ch4' | 'n2o' | 'nox' | 'sox'; // VARCHAR(30) with CHECK constraint
  concentration?: number; // DECIMAL(10,3) - ppm
  mass_rate?: number; // DECIMAL(12,3) - kg/hour
  annual_total?: number; // DECIMAL(15,3) - tonnes/year
  created_at: Date;
  updated_at: Date;
}

export interface EngineParticulateEmissions {
  particulate_id: number; // SERIAL PRIMARY KEY
  engine_id: number; // References engines(engine_id)
  measurement_date: Date; // DATE NOT NULL
  pm10_rate?: number; // DECIMAL(10,3) - kg/hour
  pm25_rate?: number; // DECIMAL(10,3) - kg/hour
  total_pm_annual?: number; // DECIMAL(12,3) - tonnes/year
  created_at: Date;
  updated_at: Date;
}

export interface EngineOtherEmissions {
  other_emission_id: number; // SERIAL PRIMARY KEY
  engine_id: number; // References engines(engine_id)
  measurement_date: Date; // DATE NOT NULL
  pollutant_type: 'mercury' | 'heavy_metals' | 'vocs'; // VARCHAR(30) with CHECK constraint
  annual_total: number; // DECIMAL(12,3) NOT NULL - kg/year
  created_at: Date;
  updated_at: Date;
}

export interface EngineWithDetails {
  engine_id: number;
  plant_id: string;
  plant_name: string; // From joined plant data
  model?: string;
  nameplate_capacity?: number;
  status: 'active' | 'inactive' | 'maintenance' | 'decommissioned';
  created_at: Date;
  updated_at: Date;
}
