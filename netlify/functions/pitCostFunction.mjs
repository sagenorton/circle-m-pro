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

    if (!pitLoads || pitLoads.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ totalCost: Infinity, logOutput: '❌ pitLoads missing or empty', location: pit })
      };
    }

    const closestYardKey = Object.keys(yardLocations).find(key =>
      addressInput.toLowerCase().includes(key.toLowerCase()) ||
      pit.closest_yard.toLowerCase().includes(key.toLowerCase())
    );
    const closestYard = yardLocations[closestYardKey];

    if (!closestYard) {
      return {
        statusCode: 200,
        body: JSON.stringify({ totalCost: Infinity, logOutput: '❌ Closest yard not found', location: pit })
      };
    }

    const yardAddress = closestYard.address || closestYard;
    
    const driveTimeYardToPit = distances.find(d =>
      d.from === yardAddress && d.to === pit.address
    )?.duration;
    
    const driveTimePitToDrop = distances.find(d =>
      d.from === pit.address && d.to === addressInput
    )?.duration;
    
    const driveTimeDropToYard = distances.find(d =>
      d.from === addressInput && d.to === yardAddress
    )?.duration;

    if (!driveTimeYardToPit || !driveTimePitToDrop || !driveTimeDropToYard) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          totalCost: Infinity,
          logOutput: `❌ Missing drive times: Y→P=${driveTimeYardToPit}, P→D=${driveTimePitToDrop}, D→Y=${driveTimeDropToYard}`,
          location: pit
        })
      };
    }

    const totalLoadAmount = pitLoads.reduce((sum, load) => sum + load.amount, 0);
    const tripCount = Math.ceil(totalLoadAmount / pitLoads[0].max);

    const totalDriveTime = driveTimeYardToPit + (driveTimePitToDrop * (tripCount * 2 - 1)) + driveTimeDropToYard;
    const adjustedTravelTime = totalDriveTime * 1.15;
    const totalJourneyTime = adjustedTravelTime + (36 * tripCount);

    let totalCost = 0;
    let detailedCosts = [];

    pitLoads.forEach(load => {
      if (!load.amount || isNaN(load.amount) || !load.rate || isNaN(load.rate)) {
        return;
      }

      let costPerUnit = (((totalJourneyTime / 60) * load.rate) / totalLoadAmount) + (pit.price || 0);
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

      if (yardCostData && isFinite(yardCostData.totalCost)) {
        detailedCosts = detailedCosts.concat(yardCostData.detailedCosts || []);
        totalCost += yardCostData.totalCost;
      }
    }

    let logOutput = "===================================\n";
    logOutput += `PIT Chosen:\n${pit.name}, ${pit.address}\n`;
    logOutput += `Truck(s):\n`;

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
