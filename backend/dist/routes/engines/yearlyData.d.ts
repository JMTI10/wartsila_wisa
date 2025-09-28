import OperationsDatabase from '../../database/connections/operationsDb';
export interface YearlyData {
    year: number;
    co2_annual_calculated: number;
    co2_annual_unit: string;
    nox_annual_calculated: number;
    nox_annual_unit: string;
    sox_annual_calculated: number;
    sox_annual_unit: string;
    net_generation_annual_calculated: number;
    net_generation_annual_unit: string;
    operating_hours_annual_calculated: number;
    capacity_factor_annual_calculated: number;
}
export declare function getEngineYearlyData(operationsDb: OperationsDatabase, engineId: string): Promise<{
    success: boolean;
    data?: YearlyData[];
    message?: string;
}>;
//# sourceMappingURL=yearlyData.d.ts.map