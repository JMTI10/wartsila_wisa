declare class OperationsDatabase {
    private pool;
    constructor();
    testConnection(): Promise<{
        success: boolean;
        message: string;
        data: any[];
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
    getEngines(): Promise<{
        success: boolean;
        data: any[];
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
    query(sql: string, params?: any[]): Promise<import("pg").QueryResult<any>>;
    close(): Promise<void>;
}
export default OperationsDatabase;
//# sourceMappingURL=operationsDb.d.ts.map