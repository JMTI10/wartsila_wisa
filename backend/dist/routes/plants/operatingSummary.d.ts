import OperationsDatabase from '../../database/connections/operationsDb';
export interface OperatingSummaryCalculated {
    total_all_time_fuel_cost: number;
    cost_per_mwh_produced_calculated: number;
    total_net_generation: number;
    measurement_period: string;
}
export declare class PlantOperatingSummaryService {
    /**
     * Get operating summary including fuel costs and cost per MWh for a plant
     * @param operationsDb Database connection
     * @param businessPlantId Business plant ID (not primary key)
     * @returns Calculated operating summary data
     */
    static getOperatingSummary(operationsDb: OperationsDatabase, businessPlantId: string): Promise<OperatingSummaryCalculated>;
}
//# sourceMappingURL=operatingSummary.d.ts.map