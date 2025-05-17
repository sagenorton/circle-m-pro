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
      yardLocations = {}
    } = JSON.parse(event.body || '{}');

    // Validate required fields early
    if (
      !Array.isArray(pitLoads) || pitLoads.length === 0 ||
      !pit || typeof pit !== 'object' ||
      !Array.isArray(distances) || distances.length === 0 ||
      !materialInfo || typeof materialInfo !== 'object'
    ) {
      console.error("❌ ERROR: Missing or invalid input fields.");
      return {
        statusCode: 400,
        body: JSON.stringify({ totalCost: Infinity, error: "Invalid input." })
      };
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

    const driveTimeYardToPit = distances.find(d =>
      d.from.includes(pit.closest_yard) || d.to.includes(pit.closest_yard)
    )?.duration;

    const driveTimePitToDrop = distances.find(d =>
      d.from.trim() === pit.address.trim()
    )?.duration;

    if (!driveTimeYardToPit || !driveTimePitToDrop) {
      console.error(`ERROR: Missing drive time for ${pit.name}.`);
      return {
        statusCode: 200,
        body: JSON.stringify({ totalCost: Infinity })
      };
    }

    // === Shared Total Journey Time for All Pit Loads ===
    const totalLoadAmount = pitLoads.reduce((sum, load) => sum + load.amount, 0);
    const maxTruckCapacity = pitLoads[0]?.max || 1;
    const tripCount = Math.ceil(totalLoadAmount / maxTruckCapacity);

    const startLeg = driveTimeYardToPit;
    const repeatLegs = (tripCount - 1) * (driveTimePitToDrop * 2);
    const finalTrip = driveTimePitToDrop + driveTimeDropToYard;

    const totalJourneyTime = (startLeg + repeatLegs + finalTrip) * 1.15 + (36 * tripCount);
    const totalTimeInHours = totalJourneyTime / 60;

    // === Group by Truck Name + Amount + Max ===
    const groupedTrucks = {};
    pitLoads.forEach(load => {
      const key = `${load.truckName}-${load.amount}-${load.max}`;
      if (!groupedTrucks[key]) {
        groupedTrucks[key] = {
          truckName: load.truckName,
          amount: load.amount,
          max: load.max,
          rate: load.rate,
          count: 1,
          totalAmount: load.amount
        };
      } else {
        groupedTrucks[key].count++;
        groupedTrucks[key].totalAmount += load.amount;
      }
    });

    // === Now calculate cost per group ===
    let totalCost = 0;
    const detailedCosts = [];

    for (const group of Object.values(groupedTrucks)) {
      const { truckName, amount, max, rate, totalAmount, count } = group;

      const costPerUnit = (totalTimeInHours * rate) / totalLoadAmount + (pit.price || 0);
      const costPerLoad = costPerUnit * totalAmount;

      totalCost += costPerLoad;

      detailedCosts.push({
        truckName,
        amount,
        max,
        count,
        costPerUnit,
        costPerLoad
      });
    }

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
        yardCostData,
        unit: materialInfo.sold_by || "unit"
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