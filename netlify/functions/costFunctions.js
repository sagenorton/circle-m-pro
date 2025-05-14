async function computeYardCosts({
  truckLoadInfo,
  yard,
  distances,
  materialInfo,
  suppressLogs = false
}) {
  let totalCost = 0;
  let detailedCosts = [];

  // Ensure we have valid distances
  if (!distances || distances.length === 0) {
    if (!suppressLogs) {
      console.warn(`No distances found for ${yard.name}. Cannot continue without distance data.`);
    }
    return { totalCost: Infinity, detailedCosts: [], location: yard };
  }

  // Resolve drive time from yard
  let driveTimeEntry = distances.find(d =>
    d.from.trim().toLowerCase() === yard.address.trim().toLowerCase() ||
    d.to.trim().toLowerCase() === yard.address.trim().toLowerCase()
  );

  if (!driveTimeEntry) {
    if (!suppressLogs) {
      console.error(`ERROR: Could not find matching drive time for yard ${yard.name}`);
    }
    return { totalCost: Infinity, detailedCosts: [], location: yard };
  }

  const driveTime = driveTimeEntry.duration;

  // Validate truck load array
  if (!Array.isArray(truckLoadInfo) || truckLoadInfo.length === 0) {
    if (!suppressLogs) {
      console.error(`ERROR: No valid truck loads for ${yard.name}.`);
    }
    return { totalCost: Infinity, detailedCosts: [], location: yard };
  }

  // Calculate costs for each truck load
  for (let load of truckLoadInfo) {
    if (!load?.amount || isNaN(load.amount) || !load?.rate || isNaN(load.rate)) {
      if (!suppressLogs) {
        console.warn("Skipping invalid load data:", load);
      }
      continue;
    }

    let costPerUnit = ((((driveTime * 2 * 1.15) + 36) / 60) * load.rate) / load.amount + (yard.price || 0);
    if (!isFinite(costPerUnit)) {
      if (!suppressLogs) {
        console.error(`Invalid costPerUnit for ${load.truckName}. Defaulting to $0.`);
      }
      costPerUnit = 0;
    }

    const costPerLoad = costPerUnit * load.amount;
    detailedCosts.push({
      truckName: load.truckName,
      rate: load.rate,
      amount: load.amount,
      costPerUnit,
      costPerLoad
    });

    totalCost += costPerLoad;
  }

  if (!isFinite(totalCost) || totalCost === 0) {
    if (!suppressLogs) {
      console.error(`Total cost calculation failed for yard ${yard.name}.`);
    }
    return { totalCost: Infinity, detailedCosts: [], location: yard };
  }

  // Optional Logging
  if (!suppressLogs) {
    console.log("===================================");
    console.log("Yard Calculation:");
    console.log(`Yard Chosen: ${yard.name}, ${yard.address}`);
    console.log(`Base Price: $${yard.price}`);
    console.log(`Round Trip Duration: ${(driveTime * 2).toFixed(2)} min`);
    console.log(`Number of Trips: ${truckLoadInfo.length}`);
    console.log(`Total Duration: ${(truckLoadInfo.length * driveTime * 2).toFixed(2)} min`);
  }

  // Grouped summary (can be used for frontend display if needed)
  const groupedTrucks = {};
  for (let load of truckLoadInfo) {
    const key = `${load.truckName}-${load.amount}-${load.rate}`;
    if (!groupedTrucks[key]) {
      groupedTrucks[key] = {
        count: 0,
        amount: load.amount,
        costPerUnit: (((driveTime * 2 * 1.15 + 36) / 60 * load.rate) / load.amount + yard.price),
        truckName: load.truckName
      };
    }
    groupedTrucks[key].count++;
  }

  if (!suppressLogs) {
    Object.values(groupedTrucks).forEach(truck => {
      console.log(`  • ${truck.count} ${truck.truckName}(s) of ${truck.amount} ${materialInfo.sold_by}s at $${truck.costPerUnit.toFixed(2)} per ${materialInfo.sold_by}`);
    });
    console.log(`\nFinal Total: $${totalCost.toFixed(2)}`);
    console.log("===================================");
  }

  return { totalCost, detailedCosts, location: yard };
}










async function computePitCosts({
  pitLoads,
  pit,
  distances,
  addressInput,
  yardLoads = [],
  materialInfo = {},
  yardLocations = {},
  suppressLogs = false
}) {
  if (!pitLoads || pitLoads.length === 0) {
    if (!suppressLogs) console.error(`ERROR: No valid pit truck loads found for ${pit.name}`);
    return { totalCost: Infinity };
  }

  const closestYardData = await getClosestYard(addressInput);
  if (!closestYardData) {
    if (!suppressLogs) console.error("ERROR: Could not determine closest yard.");
    return { totalCost: Infinity };
  }

  const finalClosestYard = closestYardData.yardName;
  const driveTimeDropToYard = closestYardData.duration;

  if (!yardLocations[finalClosestYard]) {
    if (!suppressLogs) console.error(`ERROR: Yard location not found in yardLocations for ${finalClosestYard}.`);
    return { totalCost: Infinity };
  }

  let totalCost = 0;
  let detailedCosts = [];

  const driveTimeYardToPit = distances.find(d =>
    d.from.includes(pit.closest_yard) || d.to.includes(pit.closest_yard)
  )?.duration;

  const driveTimePitToDrop = distances.find(d =>
    d.from.trim() === pit.address.trim()
  )?.duration;

  if (!driveTimeYardToPit || !driveTimePitToDrop) {
    if (!suppressLogs) console.error(`ERROR: Missing drive time for ${pit.name}.`);
    return { totalCost: Infinity };
  }

  const totalLoadAmount = pitLoads.reduce((sum, load) => sum + load.amount, 0);
  const tripCount = Math.ceil(totalLoadAmount / pitLoads[0].max);
  const totalDriveTime = driveTimeYardToPit + (driveTimePitToDrop * (tripCount * 2 - 1)) + driveTimeDropToYard;
  const adjustedTravelTime = totalDriveTime * 1.15;
  const totalJourneyTime = adjustedTravelTime + (36 * tripCount);

  // ⛽ Cost Calculation
  for (const load of pitLoads) {
    if (!load?.amount || !load?.rate || isNaN(load.amount) || isNaN(load.rate)) {
      if (!suppressLogs) console.error(`Invalid pit load:`, load);
      continue;
    }

    let costPerUnit = (((totalJourneyTime / 60) * load.rate) / totalLoadAmount) + (pit.price || 0);
    if (!isFinite(costPerUnit)) costPerUnit = 0;

    const costPerLoad = costPerUnit * load.amount;
    detailedCosts.push({ ...load, costPerUnit, costPerLoad });
    totalCost += costPerLoad;
  }

  // ➕ Add Yard Costs if needed
  let yardCostData = null;

  if (yardLoads.length > 0) {
    const assignedYard = materialInfo.locations.find(y => y.name === finalClosestYard);
    if (!assignedYard) {
      if (!suppressLogs) console.error(`ERROR: Assigned yard ${finalClosestYard} not found.`);
      return { totalCost: Infinity };
    }

    const yardDistances = await calculateDistances([{ origin: assignedYard.address, destination: addressInput }]);

    yardCostData = await computeYardCosts({
      truckLoadInfo: yardLoads,
      yard: assignedYard,
      distances: yardDistances,
      addressInput,
      materialInfo,
      suppressLogs
    });

    detailedCosts.push(...yardCostData.detailedCosts);
    totalCost += yardCostData.totalCost;
  }

  // 📊 Logging (optional)
  if (!suppressLogs) {
    console.log("===================================");
    console.log("Pit Calculations:");
    console.log(`  Pit: ${pit.name}`);
    console.log(`  Closest Yard: ${finalClosestYard}`);
    console.log(`  Trip Count: ${tripCount}`);
    console.log(`  Total Duration: ${totalJourneyTime.toFixed(2)} min`);

    const groupedTrucks = {};
    for (const load of pitLoads) {
      const key = `${load.truckName}-${load.amount}-${load.rate}`;
      if (!groupedTrucks[key]) {
        groupedTrucks[key] = {
          count: 0,
          amount: load.amount,
          truckName: load.truckName,
          costPerUnit: (((totalJourneyTime / 60) * load.rate) / totalLoadAmount) + (pit.price || 0)
        };
      }
      groupedTrucks[key].count++;
    }

    Object.values(groupedTrucks).forEach(t => {
      console.log(`    - ${t.count} ${t.truckName}(s) of ${t.amount} ${materialInfo.sold_by}s at $${t.costPerUnit.toFixed(2)} each`);
    });

    console.log(`  Base Price: $${pit.price}`);
    console.log(`  Final Total: $${totalCost.toFixed(2)}`);
    console.log("===================================");
  }

  return {
    totalCost,
    detailedCosts,
    location: pit,
    pitLoads,
    yardLoads,
    yardCostData
  };
}

module.exports = {
  computeYardCosts,
  computePitCosts
};
