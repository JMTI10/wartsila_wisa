// routes/operations/plants.ts
import { Router, Request, Response } from 'express';
import OperationsDatabase from '../../database/connections/operationsDb';
import { Plant } from '../../types/Plant';
import { EngineWithDetails } from '../../types/Engine';
import { PlantGeneralDataService } from './generalData';
import { PlantEnginesService } from './plantEngines';
import { PlantEnergyService } from './plantEnergy';
import { PlantCarbonEmissionsService } from './plantCarbonEmissions';
import { PlantOtherEmissionsService } from './plantOtherEmissions';
import { PlantOperatingSummaryService } from './operatingSummary';
import { PlantAllowancesService } from './plantAllowances';
import { PlantRenewableService } from './plantRenewableService'; // New import

const router = Router();

// Get all plants
router.get('/', async (req: Request, res: Response) => {
  console.log('🏭 Fetching plants from Operations Database...');

  try {
    const operationsDb: OperationsDatabase = req.app.locals.operationsDb;
    const result = await operationsDb.query(
      'SELECT * FROM plants ORDER BY plant_name'
    );

    console.log(
      '✅ Plants retrieved successfully:',
      result.rows.length,
      'plants found'
    );
    res.json({
      success: true,
      data: result.rows as Plant[],
      count: result.rows.length,
    });
  } catch (error) {
    console.error('❌ Error fetching plants:', error);
    res.status(500).json({
      success: false,
      message: `Failed to fetch plants: ${error}`,
    });
  }
});

// Get plant comprehensive overview
router.get('/:plantId', async (req: Request, res: Response) => {
  const { plantId } = req.params;
  console.log(`🏭 Fetching comprehensive overview for plant ${plantId}...`);

  try {
    const operationsDb: OperationsDatabase = req.app.locals.operationsDb;

    // Get general plant data and verify plant exists
    const plantGeneralData = await PlantGeneralDataService.getPlantGeneralData(
      operationsDb,
      plantId
    );

    if (!plantGeneralData) {
      return res.status(404).json({
        success: false,
        message: `Plant with ID ${plantId} not found`,
      });
    }

    const businessPlantId = plantGeneralData.plant_id;

    // Fetch all data in parallel for better performance
    const [
      enginesSummaryCalculated,
      energyTotalsCalculated,
      carbonEmissionsCalculated,
      otherEmissionsCalculated,
      operatingSummaryCalculated,
      allowancesCalculated,
      renewableFuelsCalculated, // New service call
    ] = await Promise.all([
      PlantEnginesService.getEnginesSummary(operationsDb, businessPlantId),
      PlantEnergyService.getEnergyTotals(operationsDb, businessPlantId),
      PlantCarbonEmissionsService.getCarbonEmissions(
        operationsDb,
        businessPlantId
      ),
      PlantOtherEmissionsService.getOtherEmissions(
        operationsDb,
        businessPlantId
      ),
      PlantOperatingSummaryService.getOperatingSummary(
        operationsDb,
        businessPlantId
      ),
      PlantAllowancesService.getAllowances(operationsDb, businessPlantId),
      PlantRenewableService.getRenewableFuels(operationsDb, businessPlantId), // New service call
    ]);

    // Combine all calculated data
    const combinedInfo = {
      ...plantGeneralData,
      engines: enginesSummaryCalculated,
      energy_totals: energyTotalsCalculated,
      carbon_emissions: carbonEmissionsCalculated,
      other_emissions: otherEmissionsCalculated,
      operating_summary: operatingSummaryCalculated,
      allowances: allowancesCalculated,
      renewable_fuels: renewableFuelsCalculated, // New data section
      last_updated: new Date().toISOString(),
      data_completeness_calculated: {
        engines_data: enginesSummaryCalculated.engines_list.length > 0,
        emissions_data:
          carbonEmissionsCalculated.co2_equivalent_total_calculated > 0,
        fuel_consumption_data:
          operatingSummaryCalculated.total_all_time_fuel_cost > 0,
        generation_data: energyTotalsCalculated.total_net_generation > 0,
        allowances_data: allowancesCalculated !== null,
        renewable_fuels_data:
          renewableFuelsCalculated.total_fuel_consumption > 0, // New completeness check
      },
    };

    console.log(`✅ Plant ${plantId} overview retrieved successfully`);
    res.json({
      success: true,
      data: combinedInfo,
    });
  } catch (error) {
    console.error(`❌ Error fetching plant ${plantId} overview:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to fetch plant ${plantId} overview: ${error}`,
    });
  }
});

// Get engines for a specific plant
router.get('/:plantId/engines', async (req: Request, res: Response) => {
  const { plantId } = req.params;
  console.log(`🏭 Fetching engines for plant ${plantId}...`);

  try {
    const operationsDb: OperationsDatabase = req.app.locals.operationsDb;

    // First get the business plant_id from the primary key
    const plantResult = await operationsDb.query(
      'SELECT plant_id FROM plants WHERE id = $1',
      [plantId]
    );

    if (plantResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Plant with ID ${plantId} not found`,
      });
    }

    const businessPlantId = plantResult.rows[0].plant_id;

    const result = await operationsDb.query(
      `
      SELECT 
        e.id,
        e.engine_id,
        e.engine_name,
        e.plant_id,
        p.plant_name,
        e.fuel_code,
        f.fuel_name,
        e.created_at
      FROM engines e
      JOIN plants p ON e.plant_id = p.plant_id
      JOIN fuel_types f ON e.fuel_code = f.fuel_code
      WHERE e.plant_id = $1
      ORDER BY e.engine_id
    `,
      [businessPlantId]
    );

    console.log(
      `✅ Engines for plant ${plantId} retrieved:`,
      result.rows.length,
      'engines found'
    );
    res.json({
      success: true,
      data: result.rows as EngineWithDetails[],
      count: result.rows.length,
      plant_id: plantId,
    });
  } catch (error) {
    console.error(`❌ Error fetching engines for plant ${plantId}:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to fetch engines for plant ${plantId}: ${error}`,
    });
  }
});

// Get renewable fuels breakdown for a specific plant
router.get('/:plantId/renewable-fuels', async (req: Request, res: Response) => {
  const { plantId } = req.params;
  console.log(`🌱 Fetching renewable fuels data for plant ${plantId}...`);

  try {
    const operationsDb: OperationsDatabase = req.app.locals.operationsDb;

    // First get the business plant_id from the primary key
    const plantResult = await operationsDb.query(
      'SELECT plant_id, plant_name FROM plants WHERE id = $1',
      [plantId]
    );

    if (plantResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Plant with ID ${plantId} not found`,
      });
    }

    const businessPlantId = plantResult.rows[0].plant_id;
    const plantName = plantResult.rows[0].plant_name;

    const renewableFuelsData = await PlantRenewableService.getRenewableFuels(
      operationsDb,
      businessPlantId
    );

    console.log(
      `✅ Renewable fuels data for plant ${plantId} retrieved successfully`
    );
    res.json({
      success: true,
      data: {
        plant_id: plantId,
        plant_name: plantName,
        business_plant_id: businessPlantId,
        ...renewableFuelsData,
      },
    });
  } catch (error) {
    console.error(
      `❌ Error fetching renewable fuels for plant ${plantId}:`,
      error
    );
    res.status(500).json({
      success: false,
      message: `Failed to fetch renewable fuels for plant ${plantId}: ${error}`,
    });
  }
});

export default router;
