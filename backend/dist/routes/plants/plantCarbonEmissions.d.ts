import OperationsDatabase from '../../database/connections/operationsDb';
export interface CarbonEmissionsCalculated {
    total_co2_all_time?: number;
    total_ch4_all_time?: number;
    total_n2o_all_time?: number;
    co2_equivalent_total_calculated: number;
    co2_intensity_calculated: number;
    co2_equivalent_intensity_calculated: number;
    total_net_generation_mwh?: number;
    total_gross_generation_mwh?: number;
    measurement_period: string;
}
export declare class PlantCarbonEmissionsService {
    /**
     * Get aggregated carbon emissions (CO2, CH4, N2O) for a plant
     * @param operationsDb Database connection
     * @param businessPlantId Business plant ID (not primary key)
     * @returns Calculated carbon emissions data
     */
    static getCarbonEmissions(operationsDb: OperationsDatabase, businessPlantId: string): Promise<CarbonEmissionsCalculated>;
}
//# sourceMappingURL=plantCarbonEmissions.d.ts.map