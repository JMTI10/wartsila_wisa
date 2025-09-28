import OperationsDatabase from '../../database/connections/operationsDb';
export interface EnginesSummaryCalculated {
    total_count: number;
    active_count_calculated: number;
    maintenance_count_calculated: number;
    inactive_count_calculated: number;
    decommissioned_count_calculated: number;
    total_nameplate_capacity_calculated: number;
    engines_list: any[];
}
export declare class PlantEnginesService {
    /**
     * Get engines summary for a specific plant
     * @param operationsDb Database connection
     * @param businessPlantId Business plant ID (not primary key)
     * @returns Calculated engines summary data
     */
    static getEnginesSummary(operationsDb: OperationsDatabase, businessPlantId: string): Promise<EnginesSummaryCalculated>;
}
//# sourceMappingURL=plantEngines.d.ts.map