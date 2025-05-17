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
      amountNeeded = 0,
      yardLocations = {},
    } = JSON.parse(event.body);

    if (!pitLoads || pitLoads.length === 0 || !pit || !distances || !materialInfo) {
      throw new Error("Missing required input fields.");
    }

    const apiKey = process.env.MAPS_API_KEY;

    // ---------------- Determine Closest Yard ----------------
    const getClosestYard = async (dropOffAddress) => {
      const routes = Object.entries(yardLocations).map(([name, address]) => ({
        origin: dropOffAddress,
        destination: address,
        yardName: name
      }));

      const responses = await Promise.all(routes.map(async (route) => {
        const origin = encodeURIComponent(route.origin);
        const destination = encodeURIComponent(route.destination);
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${apiKey}`;
        const res = await fetch(url);
        return res.json();
      }));

      const distances = responses.map((res, i) => {
        const element = res.rows[0].elements[0];
        return {
          from: routes[i].origin,
          to: routes[i].destination,
          duration: Math.ceil(element.duration.value / 60),
          distance: element.distance.text,
          yardName: routes[i].yardName,
          yardAddress: routes[i].destination
        };
      });

      return distances.reduce((min, curr) => curr.duration < min.duration ? curr : min);
    };

    const closestYardData = await getClosestYard(addressInput);
    if (!closestYardData) {
      return { statusCode: 200, body: JSON.stringify({ totalCost: Infinity }) };
    }

    const finalClosestYard = closestYardData.yardName;
    const driveTimeDropToYard = closestYardData.duration;

    if (!yardLocations[finalClosestYard]) {
      console.error(`ERROR: Yard location not found in yardLocations for ${finalClosestYard}.`);
      return { statusCode: 200, body: JSON.stringify({ totalCost: Infinity }) };
    }

    // ---------------- Journey Duration Calculation ----------------
    const driveTimeYardToPit = distances.find(d =>
      d.from.includes(pit.closest_yard) || d.to.includes(pit.closest_yard)
    )?.duration;

    const driveTimePitToDrop = distances.find(d =>
      d.from.trim() === pit.address.trim()
    )?.duration;

    if (!driveTimeYardToPit || !driveTimePitToDrop) {
      console.error(`ERROR: Missing drive time for ${pit.name}.`);
      return { statusCode: 200, body: JSON.stringify({ totalCost: Infinity }) };
    }

    // ---------------- Cost Calculation ----------------
    pitLoads.forEach((load, index) => {
      let baseTime = driveTimeYardToPit + (driveTimePitToDrop * 2);
      let journeyTime = index === pitLoads.length - 1
        ? baseTime + driveTimeDropToYard
        : baseTime;

      const adjustedTime = journeyTime * 1.15 + 36;
      const timeInHours = adjustedTime / 60;
      const costPerUnit = (timeInHours * load.rate) / load.amount + (pit.price || 0);
      const costPerLoad = costPerUnit * load.amount;

      detailedCosts.push({
        ...load,
        costPerUnit,
        costPerLoad
      });

      totalCost += costPerLoad;
    });

    let yardCostData = null;

    if (yardLoads.length > 0) {
      const assignedYard = materialInfo.locations.find(yard => yard.name === finalClosestYard);
      if (!assignedYard) {
        console.error(`ERROR: Could not find assigned yard (${finalClosestYard}) in material locations.`);
        return { statusCode: 200, body: JSON.stringify({ totalCost: Infinity }) };
      }

      const yardDistanceRes = await fetch("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial" +
        `&origins=${encodeURIComponent(assignedYard.address)}&destinations=${encodeURIComponent(addressInput)}&key=${apiKey}`);
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
      detailedCosts.push(...(yardCostData.detailedCosts || []));
      totalCost += yardCostData.totalCost || 0;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        totalCost: Number(totalCost.toFixed(2)),
        detailedCosts,
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
}