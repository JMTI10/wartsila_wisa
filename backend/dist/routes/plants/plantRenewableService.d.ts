import OperationsDatabase from '../../database/connections/operationsDb';
export interface RenewableFuelsCalculated {
    renewable_fuel_percentage: number;
    carbon_fuel_percentage: number;
    renewable_production_percentage: number;
    carbon_production_percentage: number;
    total_renewable_consumption: number;
    total_carbon_consumption: number;
    total_fuel_consumption: number;
    total_renewable_production: number;
    total_carbon_production: number;
    total_energy_production: number;
    renewable_fuels_breakdown: Array<{
        fuel_name: string;
        fuel_type: string;
        consumption: number;
        percentage_of_fuel_consumption: number;
        energy_production: number;
        percentage_of_energy_production: number;
    }>;
    carbon_fuels_breakdown: Array<{
        fuel_name: string;
        fuel_type: string;
        consumption: number;
        percentage_of_fuel_consumption: number;
        energy_production: number;
        percentage_of_energy_production: number;
    }>;
    measurement_period: string;
}
export declare class PlantRenewableService {
    /**
     * Get renewable vs carbon fuel consumption breakdown for a plant
     * @param operationsDb Database connection
     * @param businessPlantId Business plant ID (not primary key)
     * @returns Calculated renewable fuels data
     */
    static getRenewableFuels(operationsDb: OperationsDatabase, businessPlantId: string): Promise<RenewableFuelsCalculated>;
}
//# sourceMappingURL=plantRenewableService.d.ts.map