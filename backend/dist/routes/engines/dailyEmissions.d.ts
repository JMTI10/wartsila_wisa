import OperationsDatabase from '../../database/connections/operationsDb';
export interface DailyEmissionData {
    date: string;
    co2_emissions_calculated: number;
    co2_emissions_unit: string;
    ch4_emissions_calculated: number;
    ch4_emissions_unit: string;
    n2o_emissions_calculated: number;
    n2o_emissions_unit: string;
    nox_emissions_calculated: number;
    nox_emissions_unit: string;
    sox_emissions_calculated: number;
    sox_emissions_unit: string;
    net_generation_calculated: number;
    net_generation_unit: string;
    co2_intensity_calculated: number;
    co2_intensity_unit: string;
    hourly_co2_rate: number;
    hourly_co2_rate_unit: string;
    daily_operating_hours_calculated: number;
    daily_operating_hours_unit: string;
}
export declare function getEngineDailyEmissions(operationsDb: OperationsDatabase, engineId: string): Promise<{
    success: boolean;
    data?: DailyEmissionData[];
    message?: string;
}>;
//# sourceMappingURL=dailyEmissions.d.ts.map