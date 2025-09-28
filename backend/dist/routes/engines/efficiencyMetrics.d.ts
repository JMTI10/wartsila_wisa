import OperationsDatabase from '../../database/connections/operationsDb';
export interface EfficiencyMetrics {
    heat_rate_calculated: number | null;
    heat_rate_unit: string;
    thermal_efficiency_calculated: number | null;
    thermal_efficiency_unit: string;
}
export declare function getEngineEfficiencyMetrics(operationsDb: OperationsDatabase, engineId: string): Promise<{
    success: boolean;
    data?: EfficiencyMetrics;
    message?: string;
}>;
export declare function getTotalNetGeneration(operationsDb: OperationsDatabase, engineIds?: string[]): Promise<{
    success: boolean;
    data?: {
        total_net_generation_calculated: number;
        total_net_generation_unit: string;
    };
    message?: string;
}>;
//# sourceMappingURL=efficiencyMetrics.d.ts.map