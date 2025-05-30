export async function handler(event) {
  try {
    const {
      pitLoads,
      pit,
      distances,
      addressInput,
      yardLoads = [],
      yardTotalCost = 0,
      materialInfo = {},
      yardLocations = {},
      amountNeeded = 0,
      yardCostDataFromBackend = null // injected externally
    } = JSON.parse(event.body);

    if (!pitLoads || pitLoads.length === 0) {
      return jsonResponse({ totalCost: Infinity });
    }

    // Extract closest yard info — should be pre-fetched
    const finalClosestYard = pit.closest_yard_name;
    const driveTimeDropToYard = pit.closest_yard_duration;

    if (!yardLocations[finalClosestYard]) {
      return jsonResponse({ totalCost: Infinity });
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
      return jsonResponse({ totalCost: Infinity });
    }

    const totalLoadAmount = pitLoads.reduce((sum, load) => sum + load.amount, 0);
    const tripCount = Math.ceil(totalLoadAmount / pitLoads[0].max);

    const totalDriveTime = driveTimeYardToPit + (driveTimePitToDrop * (tripCount * 2 - 1)) + driveTimeDropToYard;
    const adjustedTravelTime = totalDriveTime * 1.15;
    const totalJourneyTime = adjustedTravelTime + (36 * tripCount);

    // Cost per load
    pitLoads.forEach(load => {
      if (!load.amount || !load.rate) return;

      let costPerUnit = (((totalJourneyTime / 60) * load.rate) / totalLoadAmount) + (pit.price || 0);
      if (!isFinite(costPerUnit)) costPerUnit = 0;

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

    // Add fallback yard logic if any
    if (yardLoads.length > 0 && yardCostDataFromBackend) {
      detailedCosts = detailedCosts.concat(yardCostDataFromBackend.detailedCosts);
      totalCost += yardCostDataFromBackend.totalCost;
    }

    // Grouped trucks for log-style reporting
    const groupedTrucks = {};
    pitLoads.forEach(load => {
      const key = `${load.truckName}-${load.amount}-${load.rate}`;
      if (!groupedTrucks[key]) {
        groupedTrucks[key] = {
          count: 0,
          amount: load.amount,
          costPerUnit: (((totalJourneyTime / 60) * load.rate) / totalLoadAmount) + (pit.price || 0),
          truckName: load.truckName
        };
      }
      groupedTrucks[key].count++;
    });

    return jsonResponse({
      totalCost,
      detailedCosts,
      location: pit,
      pitLoads,
      yardLoads,
      yardCostData: yardCostDataFromBackend,
      groupedTrucks,
      totalJourneyTime,
      finalClosestYard
    });

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", message: err.message })
    };
  }
}

function jsonResponse(data) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(data)
  };
}
