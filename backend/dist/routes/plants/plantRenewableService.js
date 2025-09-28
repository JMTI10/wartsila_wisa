"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantRenewableService = void 0;
class PlantRenewableService {
    /**
     * Get renewable vs carbon fuel consumption breakdown for a plant
     * @param operationsDb Database connection
     * @param businessPlantId Business plant ID (not primary key)
     * @returns Calculated renewable fuels data
     */
    static async getRenewableFuels(operationsDb, businessPlantId) {
        try {
            // Get fuel consumption data with fuel types AND corresponding energy generation
            const fuelConsumptionResult = await operationsDb.query(`
        SELECT 
          f.fuel_id,
          f.fuel_name,
          f.fuel_type,
          efc.engine_id,
          SUM(efc.annual_consumption) as total_consumption,
          MIN(efc.measurement_date) as earliest_date,
          MAX(efc.measurement_date) as latest_date,
          efc.annual_consumption_unit,
          -- Get corresponding energy generation for the same engines and time periods
          COALESCE(SUM(eg.net_generation), 0) as total_net_generation
        FROM engine_fuel_consumption efc
        JOIN engines e ON efc.engine_id = e.engine_id
        JOIN fuels f ON efc.fuel_id = f.fuel_id
        LEFT JOIN engine_generation eg ON (
          efc.engine_id = eg.engine_id 
          AND efc.measurement_date = eg.measurement_date
        )
        WHERE e.plant_id = $1 
          AND efc.annual_consumption IS NOT NULL
          AND efc.annual_consumption > 0
        GROUP BY f.fuel_id, f.fuel_name, f.fuel_type, efc.engine_id, efc.annual_consumption_unit
        ORDER BY total_consumption DESC
      `, [businessPlantId]);
            // Initialize the result object
            const renewableFuelsCalculated = {
                renewable_fuel_percentage: 0,
                carbon_fuel_percentage: 0,
                renewable_production_percentage: 0,
                carbon_production_percentage: 0,
                total_renewable_consumption: 0,
                total_carbon_consumption: 0,
                total_fuel_consumption: 0,
                total_renewable_production: 0,
                total_carbon_production: 0,
                total_energy_production: 0,
                renewable_fuels_breakdown: [],
                carbon_fuels_breakdown: [],
                measurement_period: 'No data available',
            };
            // Set measurement period from fuel consumption data
            if (fuelConsumptionResult.rows.length > 0) {
                const earliestDate = fuelConsumptionResult.rows[0].earliest_date
                    ?.toISOString()
                    .split('T')[0];
                const latestDate = fuelConsumptionResult.rows[0].latest_date
                    ?.toISOString()
                    .split('T')[0];
                renewableFuelsCalculated.measurement_period = `${earliestDate || 'N/A'} to ${latestDate || 'N/A'}`;
            }
            // Define renewable fuel types
            // Adjust these categories based on your actual fuel_type values in the database
            const renewableFuelTypes = [
                'biomass',
                'biogas',
                'methane', // Assuming methane from renewable sources
                'green_hydrogen',
                'renewable_methanol',
                'wind',
                'solar',
                'hydro',
            ];
            // Define carbon fuel types
            const carbonFuelTypes = [
                'coal',
                'natural_gas',
                'oil',
                'diesel',
                'heavy_fuel_oil',
                'lng',
                'petroleum',
                'fossil_methanol',
            ];
            let totalRenewableConsumption = 0;
            let totalCarbonConsumption = 0;
            let totalFuelConsumption = 0;
            let totalRenewableProduction = 0;
            let totalCarbonProduction = 0;
            let totalEnergyProduction = 0;
            // Aggregate fuel data by fuel type (since we now have engine_id in results)
            const fuelAggregation = new Map();
            fuelConsumptionResult.rows.forEach((row) => {
                const fuelKey = `${row.fuel_id}-${row.fuel_name}-${row.fuel_type}`;
                if (!fuelAggregation.has(fuelKey)) {
                    fuelAggregation.set(fuelKey, {
                        fuel_id: row.fuel_id,
                        fuel_name: row.fuel_name,
                        fuel_type: row.fuel_type,
                        total_consumption: 0,
                        total_net_generation: 0,
                        earliest_date: row.earliest_date,
                        latest_date: row.latest_date,
                        annual_consumption_unit: row.annual_consumption_unit,
                    });
                }
                const aggregated = fuelAggregation.get(fuelKey);
                aggregated.total_consumption += parseFloat(row.total_consumption || 0);
                aggregated.total_net_generation += parseFloat(row.total_net_generation || 0);
                // Keep the earliest and latest dates across all engines
                if (row.earliest_date < aggregated.earliest_date) {
                    aggregated.earliest_date = row.earliest_date;
                }
                if (row.latest_date > aggregated.latest_date) {
                    aggregated.latest_date = row.latest_date;
                }
            });
            // Process aggregated fuel consumption and production data
            Array.from(fuelAggregation.values()).forEach((fuel) => {
                const consumption = fuel.total_consumption;
                const production = fuel.total_net_generation;
                const fuelType = fuel.fuel_type?.toLowerCase();
                const fuelName = fuel.fuel_name;
                totalFuelConsumption += consumption;
                totalEnergyProduction += production;
                // Check if fuel is renewable
                const isRenewable = renewableFuelTypes.some((renewableType) => fuelType?.includes(renewableType) ||
                    fuelName?.toLowerCase().includes(renewableType));
                // Check if fuel is carbon-based
                const isCarbon = carbonFuelTypes.some((carbonType) => fuelType?.includes(carbonType) ||
                    fuelName?.toLowerCase().includes(carbonType));
                if (isRenewable) {
                    totalRenewableConsumption += consumption;
                    totalRenewableProduction += production;
                    renewableFuelsCalculated.renewable_fuels_breakdown.push({
                        fuel_name: fuelName,
                        fuel_type: fuel.fuel_type,
                        consumption: consumption,
                        percentage_of_fuel_consumption: 0, // Will be calculated after totals are known
                        energy_production: production,
                        percentage_of_energy_production: 0, // Will be calculated after totals are known
                    });
                }
                else if (isCarbon) {
                    totalCarbonConsumption += consumption;
                    totalCarbonProduction += production;
                    renewableFuelsCalculated.carbon_fuels_breakdown.push({
                        fuel_name: fuelName,
                        fuel_type: fuel.fuel_type,
                        consumption: consumption,
                        percentage_of_fuel_consumption: 0, // Will be calculated after totals are known
                        energy_production: production,
                        percentage_of_energy_production: 0, // Will be calculated after totals are known
                    });
                }
                else {
                    // Handle unclassified fuels - default to carbon unless explicitly renewable
                    console.warn(`⚠️ Unclassified fuel type: ${fuelType} (${fuelName}) - defaulting to carbon fuel`);
                    totalCarbonConsumption += consumption;
                    totalCarbonProduction += production;
                    renewableFuelsCalculated.carbon_fuels_breakdown.push({
                        fuel_name: fuelName,
                        fuel_type: fuel.fuel_type || 'unclassified',
                        consumption: consumption,
                        percentage_of_fuel_consumption: 0,
                        energy_production: production,
                        percentage_of_energy_production: 0,
                    });
                }
            });
            // Calculate percentages for both fuel consumption and energy production
            if (totalFuelConsumption > 0) {
                renewableFuelsCalculated.renewable_fuel_percentage =
                    (totalRenewableConsumption / totalFuelConsumption) * 100;
                renewableFuelsCalculated.carbon_fuel_percentage =
                    (totalCarbonConsumption / totalFuelConsumption) * 100;
                // Update individual fuel consumption percentages
                renewableFuelsCalculated.renewable_fuels_breakdown.forEach((fuel) => {
                    fuel.percentage_of_fuel_consumption =
                        (fuel.consumption / totalFuelConsumption) * 100;
                });
                renewableFuelsCalculated.carbon_fuels_breakdown.forEach((fuel) => {
                    fuel.percentage_of_fuel_consumption =
                        (fuel.consumption / totalFuelConsumption) * 100;
                });
            }
            if (totalEnergyProduction > 0) {
                renewableFuelsCalculated.renewable_production_percentage =
                    (totalRenewableProduction / totalEnergyProduction) * 100;
                renewableFuelsCalculated.carbon_production_percentage =
                    (totalCarbonProduction / totalEnergyProduction) * 100;
                // Update individual fuel production percentages
                renewableFuelsCalculated.renewable_fuels_breakdown.forEach((fuel) => {
                    fuel.percentage_of_energy_production =
                        (fuel.energy_production / totalEnergyProduction) * 100;
                });
                renewableFuelsCalculated.carbon_fuels_breakdown.forEach((fuel) => {
                    fuel.percentage_of_energy_production =
                        (fuel.energy_production / totalEnergyProduction) * 100;
                });
            }
            // Set totals
            renewableFuelsCalculated.total_renewable_consumption =
                totalRenewableConsumption;
            renewableFuelsCalculated.total_carbon_consumption =
                totalCarbonConsumption;
            renewableFuelsCalculated.total_fuel_consumption = totalFuelConsumption;
            renewableFuelsCalculated.total_renewable_production =
                totalRenewableProduction;
            renewableFuelsCalculated.total_carbon_production = totalCarbonProduction;
            renewableFuelsCalculated.total_energy_production = totalEnergyProduction;
            return renewableFuelsCalculated;
        }
        catch (error) {
            console.error('❌ Error fetching renewable fuels data:', error);
            throw error;
        }
    }
}
exports.PlantRenewableService = PlantRenewableService;
//# sourceMappingURL=plantRenewableService.js.map