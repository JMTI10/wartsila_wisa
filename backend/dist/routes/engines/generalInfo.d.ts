import OperationsDatabase from '../../database/connections/operationsDb';
import { Engine } from '../../types/Engine';
export declare function getEngineGeneralInfo(operationsDb: OperationsDatabase, engineId: string): Promise<{
    success: boolean;
    data?: Engine;
    message?: string;
}>;
//# sourceMappingURL=generalInfo.d.ts.map