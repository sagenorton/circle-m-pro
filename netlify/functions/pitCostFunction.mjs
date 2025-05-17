import fetch from 'node-fetch';

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
      amountNeeded = 0
    } = JSON.parse(event.body || '{}');

    let logOutput = "";
    let totalCost = 0;
    let detailedCosts = [];
    let yardCostData = null;

    if (!pitLoads || pitLoads.length === 0) {
      console.error(`ERROR: No valid pit truck loads found for ${pit.name}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ totalCost: Infinity, logOutput })
      };
    }

    // Simulated backend version of getClosestYard
    const closestYardKey = Object.keys(yardLocations).find(key =>
      addressInput.toLowerCase().includes(key.toLowerCase()) || pit.closest_yard.toLowerCase().includes(key.toLowerCase())
    );
    const closestYard = yardLocations[closestYardKey];

    if (!closestYard) {
      const msg = "ERROR: Could not determine closest yard.";
      console.error(msg);
      return {
        statusCode: 200,
        body: JSON.stringify({ totalCost: Infinity, logOutput: msg })
      };
    }

    const driveTimeYardToPit = distances.find(d =>
      d.from.includes(pit.closest_yard) || d.to.includes(pit.closest_yard)
    )?.duration;

    const driveTimePitToDrop = distances.find(d =>
      d.from.trim() === pit.address.trim()
    )?.duration;

    const driveTimeDropToYard = distances.find(d =>
      d.to.includes(closestYard.address) || d.from.includes(closestYard.address)
    )?.duration;

    if (!driveTimeYardToPit || !driveTimePitToDrop || !driveTimeDropToYard) {
      const msg = `ERROR: Missing drive time for ${pit.name}.`;
      console.error(msg);
      return {
        statusCode: 200,
        body: JSON.stringify({ totalCost: Infinity, logOutput: msg })
      };
    }

    const totalLoadAmount = pitLoads.reduce((sum, load) => sum + load.amount, 0);
    const tripCount = Math.ceil(totalLoadAmount / pitLoads[0].max);

    const totalDriveTime = driveTimeYardToPit + (driveTimePitToDrop * (tripCount * 2 - 1)) + driveTimeDropToYard;
    const adjustedTravelTime = totalDriveTime * 1.15;
    const totalJourneyTime = adjustedTravelTime + (36 * tripCount);

    pitLoads.forEach(load => {
      if (!load.amount || !load.rate || isNaN(load.amount) || isNaN(load.rate)) {
        console.error(`ERROR: Invalid pit load:`, load);
        return;
      }

      const costPerUnit = (((totalJourneyTime / 60) * load.rate) / totalLoadAmount) + (pit.price || 0);
      const costPerLoad = costPerUnit * load.amount;

      detailedCosts.push({
        truckName: load.truckName,
        rate: load.rate,
        amount: load.amount,
        costPerUnit: isFinite(costPerUnit) ? costPerUnit : 0,
        costPerLoad: isFinite(costPerLoad) ? costPerLoad : 0
      });

      totalCost += isFinite(costPerLoad) ? costPerLoad : 0;
    });

    // Process YARD loads via backend if applicable
    if (yardLoads.length > 0 && closestYard) {
      const yardResponse = await fetch(`${process.env.URL}/.netlify/functions/yardCostFunction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          truckLoadInfo: yardLoads,
          yard: closestYard,
          distances,
          addressInput,
          materialInfo
        })
      });

      yardCostData = await yardResponse.json();

      if (isFinite(yardCostData.totalCost)) {
        detailedCosts = detailedCosts.concat(yardCostData.detailedCosts || []);
        totalCost += yardCostData.totalCost;
      }
    }

    // Grouped truck logging
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

    // Optional: you can strip or return `logOutput` if needed
    logOutput += "===================================\n";
    logOutput += `PIT Chosen:\n${pit.name}, ${pit.address}\n`;
    logOutput += `Truck(s):\n`;
    Object.values(groupedTrucks).forEach(truck => {
      logOutput += `  - ${truck.count} ${truck.truckName}(s) of ${truck.amount} ${materialInfo.sold_by}s at $${truck.costPerUnit.toFixed(2)}\n`;
    });
    logOutput += `Final Total: $${totalCost.toFixed(2)}\n`;
    logOutput += "===================================\n";

    return {
      statusCode: 200,
      body: JSON.stringify({
        totalCost,
        detailedCosts,
        location: pit,
        pitLoads,
        yardLoads,
        yardCostData,
        logOutput
      })
    };

  } catch (error) {
    console.error("Fatal error in pitCostFunction:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error in pitCostFunction." })
    };
  }
}
