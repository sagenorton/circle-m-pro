export async function computePitCosts(
    pitLoads,
    pit,
    distances,
    addressInput,
    yardLoads = [],
    yardTotalCost = 0,
    materialInfo = {},
    yardLocations = {},
    amountNeeded = 0,
    getClosestYard,
    calculateDistances,
    computeYardCosts
) {
    // Ensure these values are defined to prevent errors
    yardTotalCost = yardTotalCost || 0;
    materialInfo = materialInfo || {};
    amountNeeded = amountNeeded || 0;

    // Check if there are valid pit truck loads
    if (!pitLoads || pitLoads.length === 0) {
        console.error(`ERROR: No valid pit truck loads found for ${pit.name}`);
        return { totalCost: Infinity };
    }

    // Get the closest yard data based on distance (not material availability)
    const closestYardData = await getClosestYard(addressInput);
    if (!closestYardData) {
        console.error("ERROR: Could not determine closest yard.");
        return { totalCost: Infinity };
    }

    const finalClosestYard = closestYardData.yardName;
    let driveTimeDropToYard = closestYardData.duration;

    // Ensure yardLocations is defined before using it
    if (!yardLocations || !yardLocations[finalClosestYard]) {
        console.error(`ERROR: Yard location not found in yardLocations for ${finalClosestYard}.`);
        return { totalCost: Infinity };
    }

    let totalCost = 0;
    let detailedCosts = [];

    // Find the drive times for the journey
    let driveTimeYardToPit = distances.find(d => d.from.includes(pit.closest_yard) || d.to.includes(pit.closest_yard))?.duration;
    let driveTimePitToDrop = distances.find(d => d.from.trim() === pit.address.trim())?.duration;

    if (!driveTimeYardToPit || !driveTimePitToDrop) {
        console.error(`ERROR: Missing drive time for ${pit.name}.`);
        return { totalCost: Infinity };
    }

    // Calculate the total load amount and the number of trips needed
    const totalLoadAmount = pitLoads.reduce((sum, load) => sum + load.amount, 0);
    let tripCount = Math.ceil(totalLoadAmount / pitLoads[0].max);

    // Calculate the total drive time for all trips
    let totalDriveTime = driveTimeYardToPit + (driveTimePitToDrop * (tripCount * 2 - 1)) + driveTimeDropToYard;

    // Adjust the travel time with a multiplier
    let adjustedTravelTime = totalDriveTime * 1.15;

    // Calculate the final total journey time including load/unload time
    let totalJourneyTime = adjustedTravelTime + (36 * tripCount);

    // Calculate the cost for each pit load
    pitLoads.forEach(load => {
        if (!load.amount || isNaN(load.amount) || !load.rate || isNaN(load.rate)) {
            console.error(`ERROR: Invalid pit load found:`, load);
            return;
        }

        let costPerUnit = (((totalJourneyTime / 60) * load.rate) / totalLoadAmount) + (pit.price || 0);

        if (isNaN(costPerUnit) || !isFinite(costPerUnit)) {
            console.error(`ERROR: Invalid costPerUnit for ${load.truckName}. Defaulting to $0.`);
            costPerUnit = 0;
        }

        let costPerLoad = costPerUnit * load.amount;

        detailedCosts.push({
            truckName: load.truckName,
            rate: load.rate,
            amount: load.amount,
            costPerUnit,
            costPerLoad
        });

        totalCost += costPerLoad;
    });

    let yardCostData = null;

    if (yardLoads && yardLoads.length > 0) {
        // Find the assigned yard
        let assignedYard = materialInfo.locations.find(yard => yard.name === finalClosestYard);
        if (!assignedYard) {
            console.error(`ERROR: Could not find assigned yard (${finalClosestYard}) in material locations.`);
            return { totalCost: Infinity, detailedCosts: [], location: pit, pitLoads, yardLoads };
        }

        // Compute distances for yard separately
        let yardDistances = await calculateDistances([{ origin: assignedYard.address, destination: addressInput }]);

        // Ensure correct yard pricing is used
        yardCostData = await computeYardCosts(yardLoads, assignedYard, yardDistances, addressInput, materialInfo);

        detailedCosts = detailedCosts.concat(yardCostData.detailedCosts);
        totalCost += yardCostData.totalCost;
    }

    return { totalCost, detailedCosts, location: pit, pitLoads, yardLoads, yardCostData };
}
