import { FuelType } from './FuelType';

export interface Engine {
  id: number;
  engine_id: string;
  engine_name: string;
  plant_id: number;
  fuel_code: FuelType;
  created_at: Date;
}

export interface EngineWithDetails {
  id: number;
  engine_id: string;
  engine_name: string;
  plant_id: number;
  plant_name: string;
  fuel_code: FuelType;
  fuel_name: string;
  created_at: Date;
}
