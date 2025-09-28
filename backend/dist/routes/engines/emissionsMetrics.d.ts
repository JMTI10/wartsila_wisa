import OperationsDatabase from '../../database/connections/operationsDb';
export interface EmissionRates {
    co2_rate: number | null;
    co2_rate_unit: string;
    nox_rate: number | null;
    nox_rate_unit: string;
    sox_rate: number | null;
    sox_rate_unit: string;
}
export interface EmissionsMetrics {
    co2_intensity_calculated: number | null;
    co2_intensity_calculated_unit: string;
    emissions_per_unit_production_calculated: {
        co2_per_unit: number | null;
        co2_per_unit_unit: string;
        nox_per_unit: number | null;
        nox_per_unit_unit: string;
        sox_per_unit: number | null;
        sox_per_unit_unit: string;
    };
    emissions_per_unit_revenue_calculated: {
        co2_per_revenue: number | null;
        co2_per_revenue_unit: string;
        nox_per_revenue: number | null;
        nox_per_revenue_unit: string;
        sox_per_revenue: number | null;
        sox_per_revenue_unit: string;
    };
    co2_per_unit_fuel_consumed_calculated: {
        co2_per_fuel: number | null;
        co2_per_fuel_unit: string;
    };
    emission_rates: EmissionRates;
}
export declare function getEngineEmissionsMetrics(operationsDb: OperationsDatabase, engineId: string, totalNetGeneration: number, totalOperatingHours: number): Promise<{
    success: boolean;
    data?: EmissionsMetrics;
    message?: string;
}>;
//# sourceMappingURL=emissionsMetrics.d.ts.map