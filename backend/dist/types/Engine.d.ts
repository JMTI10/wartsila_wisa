export interface Engine {
    engine_id: number;
    plant_id: string;
    model?: string;
    nameplate_capacity?: number;
    status: 'active' | 'inactive' | 'maintenance' | 'decommissioned';
    created_at: Date;
    updated_at: Date;
}
export interface EngineFuelConsumption {
    consumption_id: number;
    engine_id: number;
    fuel_id: number;
    measurement_date: Date;
    consumption_rate: number;
    consumption_rate_unit: string;
    annual_consumption?: number;
    fuel_cost_per_day?: number;
    annual_consumption_unit?: string;
    fuel_energy_input?: number;
    created_at: Date;
    updated_at: Date;
}
export interface EngineGeneration {
    generation_id: number;
    engine_id: number;
    measurement_date: Date;
    gross_generation?: number;
    net_generation?: number;
    auxiliary_power?: number;
    operating_hours?: number;
    capacity_factor?: number;
    created_at: Date;
    updated_at: Date;
}
export interface EngineStackEmissions {
    emission_id: number;
    engine_id: number;
    measurement_date: Date;
    pollutant_type: 'co2' | 'ch4' | 'n2o' | 'nox' | 'sox';
    concentration?: number;
    mass_rate?: number;
    annual_total?: number;
    created_at: Date;
    updated_at: Date;
}
export interface EngineParticulateEmissions {
    particulate_id: number;
    engine_id: number;
    measurement_date: Date;
    pm10_rate?: number;
    pm25_rate?: number;
    total_pm_annual?: number;
    created_at: Date;
    updated_at: Date;
}
export interface EngineOtherEmissions {
    other_emission_id: number;
    engine_id: number;
    measurement_date: Date;
    pollutant_type: 'mercury' | 'heavy_metals' | 'vocs';
    annual_total: number;
    created_at: Date;
    updated_at: Date;
}
export interface EngineWithDetails {
    engine_id: number;
    plant_id: string;
    plant_name: string;
    model?: string;
    nameplate_capacity?: number;
    status: 'active' | 'inactive' | 'maintenance' | 'decommissioned';
    created_at: Date;
    updated_at: Date;
}
//# sourceMappingURL=Engine.d.ts.map