import fetch from 'node-fetch';

export async function handler(event) {
  try {
    const {
      pitLoads,
      pit,
      distances,
      addressInput,
      yardLoads = [],
      materialInfo = {},
      amountNeeded = 0,
      yardLocations = {}
    } = JSON.parse(event.body);

    if (!pitLoads || !pit || !distances || !materialInfo) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required input fields." })
      };
    }

    if (!pitLoads.length) {
      return {
        statusCode: 200,
        body: JSON.stringify({ totalCost: Infinity })
      };
    }

    // Get closest yard info
    const apiKey = process.env.MAPS_API_KEY;
    const routes = Object.entries(yardLocations).map(([name, address]) => ({
      origin: addressInput,
      destination: address,
      yardName: name
    }));

    const responses = await Promise.all(
      routes.map(async route => {
        const origin = encodeURIComponent(route.origin);
        const destination = encodeURIComponent(route.destination);
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${apiKey}`;
        const res = await fetch(url);
        return res.json();
      })
    );

    const yardTimes = responses.map((res, i) => {
      const element = res.rows[0].elements[0];
      return {
        duration: Math.ceil(element.duration.value / 60),
        yardName: routes[i].yardName
      };
    });

    const closest = yardTimes.reduce((a, b) => (a.duration < b.duration ? a : b));
    const finalClosestYard = closest.yardName;
    const driveTimeDropToYard = closest.duration;

    if (!yardLocations[finalClosestYard]) {
      return {
        statusCode: 200,
        body: JSON.stringify({ totalCost: Infinity })
      };
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
      return {
        statusCode: 200,
        body: JSON.stringify({ totalCost: Infinity })
      };
    }

    const totalLoadAmount = pitLoads.reduce((sum, load) => sum + load.amount, 0);
    const tripCount = Math.ceil(totalLoadAmount / pitLoads[0].max);

    const totalDriveTime = driveTimeYardToPit + (driveTimePitToDrop * (tripCount * 2 - 1)) + driveTimeDropToYard;
    const adjustedTravelTime = totalDriveTime * 1.15;
    const totalJourneyTime = adjustedTravelTime + (36 * tripCount);

    for (const load of pitLoads) {
      const costPerUnit = (((totalJourneyTime / 60) * load.rate) / totalLoadAmount) + (pit.price || 0);
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

    // Compute yard cost if overflow
    let yardCostData = null;
    if (yardLoads.length > 0) {
      const assignedYard = materialInfo.locations.find(y => y.name === finalClosestYard);
      if (!assignedYard) {
        return {
          statusCode: 200,
          body: JSON.stringify({ totalCost: Infinity, detailedCosts, location: pit, pitLoads, yardLoads })
        };
      }

      const yardDistanceRes = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${encodeURIComponent(assignedYard.address)}&destinations=${encodeURIComponent(addressInput)}&key=${apiKey}`);
      const yardDistanceData = await yardDistanceRes.json();
      const yardDistances = [{
        from: assignedYard.address,
        to: addressInput,
        duration: Math.ceil(yardDistanceData.rows[0].elements[0].duration.value / 60)
      }];

      const yardCostRes = await fetch(`${process.env.BASE_URL || ''}/.netlify/functions/yardCostFunction`, {
        method: "POST",
        body: JSON.stringify({
          truckLoadInfo: yardLoads,
          yard: assignedYard,
          distances: yardDistances,
          addressInput,
          materialInfo,
          suppressLogs: true
        })
      });

      yardCostData = await yardCostRes.json();
      detailedCosts = detailedCosts.concat(yardCostData.detailedCosts || []);
      totalCost += yardCostData.totalCost || 0;
    }

    let groupedTrucks = {};

    detailedCosts.forEach(load => {
      const key = `${load.truckName}-${load.amount}-${load.rate}-${load.max}`;
      if (!groupedTrucks[key]) {
        groupedTrucks[key] = {
          truckName: load.truckName,
          amount: load.amount,
          rate: load.rate,
          max: load.max,
          costPerUnit: load.costPerUnit,
          count: 1
        };
      } else {
        groupedTrucks[key].count++;
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        totalCost: Number(totalCost.toFixed(2)),
        detailedCosts,
        groupedTrucks: Object.values(groupedTrucks),
        location: pit,
        pitLoads,
        yardLoads,
        yardCostData
      })
    };

  } catch (err) {
    console.error("Fatal error in pitCostFunction:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error in pitCostFunction." })
    };
  }
};

