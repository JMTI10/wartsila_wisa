declare class MetricsDatabase {
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
    getPlantMetrics(): Promise<{
        success: boolean;
        data: any[];
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
    close(): Promise<void>;
}
export default MetricsDatabase;
//# sourceMappingURL=metricsDb.d.ts.map