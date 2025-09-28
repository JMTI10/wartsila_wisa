import OperationsDatabase from '../../database/connections/operationsDb';
export interface EnergyTotalsCalculated {
    total_gross_generation: number;
    total_net_generation: number;
    total_auxiliary_power: number;
    total_operating_hours: number;
    average_capacity_factor_calculated: number;
    measurement_period: string;
}
export declare class PlantEnergyService {
    /**
     * Get aggregated energy generation data for all engines in a plant
     * @param operationsDb Database connection
     * @param businessPlantId Business plant ID (not primary key)
     * @returns Calculated energy totals data
     */
    static getEnergyTotals(operationsDb: OperationsDatabase, businessPlantId: string): Promise<EnergyTotalsCalculated>;
}
//# sourceMappingURL=plantEnergy.d.ts.map