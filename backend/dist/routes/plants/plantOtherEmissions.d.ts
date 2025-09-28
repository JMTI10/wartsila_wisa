import OperationsDatabase from '../../database/connections/operationsDb';
export interface OtherEmissionsCalculated {
    total_nox_all_time?: number;
    total_sox_all_time?: number;
    total_pm10_all_time_calculated?: number;
    total_pm25_all_time_calculated?: number;
    nox_intensity_calculated?: number;
    sox_intensity_calculated?: number;
    pm10_intensity_calculated?: number;
    pm25_intensity_calculated?: number;
    measurement_period: string;
    [key: string]: number | string | undefined;
}
export declare class PlantOtherEmissionsService {
    /**
     * Get aggregated other pollutant emissions for a plant (NOx, SOx, PM, etc.) with intensity calculations
     * @param operationsDb Database connection
     * @param businessPlantId Business plant ID (not primary key)
     * @param totalNetGeneration Optional total net generation to calculate intensity (if not provided, intensity will be 0)
     * @returns Calculated other emissions data including intensity metrics
     */
    static getOtherEmissions(operationsDb: OperationsDatabase, businessPlantId: string, totalNetGeneration?: number): Promise<OtherEmissionsCalculated>;
}
//# sourceMappingURL=plantOtherEmissions.d.ts.map