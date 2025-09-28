import OperationsDatabase from '../../database/connections/operationsDb';
export declare class PlantGeneralDataService {
    /**
     * Get general plant data by plant ID
     * @param operationsDb Database connection
     * @param plantId Primary key ID of the plant
     * @returns Plant data or null if not found
     */
    static getPlantGeneralData(operationsDb: OperationsDatabase, plantId: string): Promise<any | null>;
}
//# sourceMappingURL=generalData.d.ts.map