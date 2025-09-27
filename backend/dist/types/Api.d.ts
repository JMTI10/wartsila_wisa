import { FuelType } from './FuelType';
export interface CreatePlantRequest {
    plant_id: string;
    plant_name: string;
}
export interface CreateEngineRequest {
    engine_id: string;
    engine_name: string;
    plant_id: number;
    fuel_code: FuelType;
}
//# sourceMappingURL=Api.d.ts.map