import OperationsDatabase from '../../database/connections/operationsDb';
export interface AllowancesCalculated {
    allocation_year: number;
    total_allowances_available: number;
    estimated_co2_emissions: number;
    allowances_needed_calculated: number;
    allowances_surplus_calculated: number;
}
export declare class PlantAllowancesService {
    /**
     * Get allowance data for a plant (current year)
     * @param operationsDb Database connection
     * @param businessPlantId Business plant ID (not primary key)
     * @returns Calculated allowances data or null if no data available
     */
    static getAllowances(operationsDb: OperationsDatabase, businessPlantId: string): Promise<AllowancesCalculated | null>;
}
//# sourceMappingURL=plantAllowances.d.ts.map