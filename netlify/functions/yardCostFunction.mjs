export async function handler(event) {
  try {
    const { truckLoadInfo, yard, distances, addressInput, materialInfo, suppressLogs = false } = JSON.parse(event.body);

    let totalCost = 0;
    let detailedCosts = [];

    if (!distances || distances.length === 0) {
      if (!addressInput) {
        return jsonResponse({ totalCost: Infinity, detailedCosts: [], location: yard });
      }

      return jsonResponse({ totalCost: Infinity, detailedCosts: [], location: yard });
    }

    if (!yard.initialDriveTime) {
      let match = distances.find(d =>
        d.from.trim().toLowerCase() === yard.address.trim().toLowerCase() ||
        d.to.trim().toLowerCase() === yard.address.trim().toLowerCase()
      );

      if (!match) return jsonResponse({ totalCost: Infinity, detailedCosts: [], location: yard });

      yard.initialDriveTime = match.duration;
    }

    let driveTime = yard.initialDriveTime || 0;

    if (!truckLoadInfo || !Array.isArray(truckLoadInfo) || truckLoadInfo.length === 0) {
      return jsonResponse({ totalCost: Infinity, detailedCosts: [], location: yard });
    }

    for (let load of truckLoadInfo) {
      if (!load.amount || !load.rate) continue;

      let costPerUnit = (((((driveTime * 2 * 1.15) + 36) / 60) * load.rate) / (load.amount || 1)) + (yard.price || 0);
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
    }

    if (!isFinite(totalCost) || totalCost === 0) {
      return jsonResponse({ totalCost: Infinity, detailedCosts: [], location: yard });
    }

    let groupedTrucks = {};
    truckLoadInfo.forEach(load => {
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
    });

    return jsonResponse({ totalCost, detailedCosts, location: yard });

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
