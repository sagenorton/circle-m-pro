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
      amountNeeded,
      yardLocations = {},
    } = JSON.parse(event.body);

    if (!pitLoads || !pit || !distances || !materialInfo) {
      throw new Error("Missing required input fields.");
    }

    if (!pitLoads || pitLoads.length === 0) {
      console.error(`ERROR: No valid pit truck loads found for ${pit.name}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ totalCost: Infinity })
      };
    }

    // Fetch closest yard based on distance
    const apiKey = process.env.MAPS_API_KEY;
    const getClosestYard = async (dropOffAddress) => {
      const routes = Object.entries(yardLocations).map(([name, address]) => ({
        origin: dropOffAddress,
        destination: address,
        yardName: name
      }));

    const responses = await Promise.all(
      routes.map(async (route) => {
        const origin = encodeURIComponent(route.origin);
        const destination = encodeURIComponent(route.destination);
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${apiKey}`;
        const res = await fetch(url);
        return res.json();
      })
    );

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
      console.error("ERROR: Could not determine closest yard.");
      return { statusCode: 200, body: JSON.stringify({ totalCost: Infinity }) };
    }

    const finalClosestYard = closestYardData.yardName;
    const driveTimeDropToYard = closestYardData.duration;

    if (!yardLocations[finalClosestYard]) {
      console.error(`ERROR: Yard location not found in yardLocations for ${finalClosestYard}.`);
      return { statusCode: 200, body: JSON.stringify({ totalCost: Infinity }) };
    }

    let totalCost = 0;
    let detailedCosts = [];

    // Extract drive times from distances
    const driveTimeYardToPit = distances.find(d => d.from.includes(pit.closest_yard) || d.to.includes(pit.closest_yard))?.duration;
    const driveTimePitToDrop = distances.find(d => d.from.trim() === pit.address.trim())?.duration;

    if (!driveTimeYardToPit || !driveTimePitToDrop) {
      console.error(`ERROR: Missing drive time for ${pit.name}.`);
      return { statusCode: 200, body: JSON.stringify({ totalCost: Infinity }) };
    }

    const totalLoadAmount = pitLoads.reduce((sum, load) => sum + load.amount, 0);
    const tripCount = pitLoads.length;

    const totalDriveTime =
      driveTimeYardToPit +
      (driveTimePitToDrop * (tripCount * 2 - 1)) +
      driveTimeDropToYard;

    const adjustedTravelTime = totalDriveTime * 1.15;
    const totalJourneyTime = adjustedTravelTime + (36 * tripCount);

    pitLoads.forEach((load, index) => {
      if (!load.amount || isNaN(load.amount) || !load.rate || isNaN(load.rate)) {
        console.error(`ERROR: Invalid pit load found:`, load);
        return;
      }

      // Calculate journey time per truck
      let journeyTime = driveTimeYardToPit + (driveTimePitToDrop * 2);
      if (index === pitLoads.length - 1) {
        journeyTime += driveTimeDropToYard;
      }

      const adjustedJourneyTime = journeyTime * 1.15 + 36;

      const costPerUnit = ((adjustedJourneyTime / 60) * load.rate) / load.amount + (pit.price || 0);
      const costPerLoad = costPerUnit * load.amount;

      detailedCosts.push({
        ...load,
        costPerUnit,
        costPerLoad
      });

      totalCost += costPerLoad;
    });

    totalCost = Number(totalCost.toFixed(2));

    // If yardLoads are used (pit+yard case), compute costs via backend
    let yardCostData = null;
    if (yardLoads.length > 0) {
      console.log("Processing overflow yard loads separately...");

      const assignedYard = materialInfo.locations.find(yard => yard.name === finalClosestYard);
      if (!assignedYard) {
        console.error(`ERROR: Could not find assigned yard (${finalClosestYard}) in material locations.`);
        return {
          statusCode: 200,
          body: JSON.stringify({ totalCost: Infinity, detailedCosts, location: pit, pitLoads, yardLoads })
        };
      }

      const yardDistanceResults = await fetch("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial" +
        `&origins=${encodeURIComponent(assignedYard.address)}&destinations=${encodeURIComponent(addressInput)}&key=${apiKey}`)
        .then(res => res.json())
        .then(data => [{
          from: assignedYard.address,
          to: addressInput,
          duration: Math.ceil(data.rows[0].elements[0].duration.value / 60)
        }]);

      const yardCostRes = await fetch(`${process.env.BASE_URL || ''}/.netlify/functions/yardCostFunction`, {
        method: "POST",
        body: JSON.stringify({
          truckLoadInfo: yardLoads,
          yard: assignedYard,
          distances: yardDistanceResults,
          addressInput,
          materialInfo,
          suppressLogs: true
        })
      });

      yardCostData = await yardCostRes.json();
      detailedCosts = detailedCosts.concat(yardCostData.detailedCosts || []);
      totalCost += yardCostData.totalCost || 0;
    }

    // === LOGGING ===
    console.log("===================================");
    console.log("Pit Calculations:");
    console.log(`Pit:`);
    console.log(`  Starting from: ${pit.closest_yard}`);
    console.log(`  Going to Pit: ${pit.name}, ${pit.address}`);
    console.log(`  Duration/Distance: ${driveTimeYardToPit} min`);
    console.log(`  Drop off at: ${addressInput}`);
    console.log(`  Duration/Distance: ${driveTimePitToDrop} min`);
    console.log(`  Number of trips: ${tripCount}`);
    console.log(`  Ending at: ${finalClosestYard}`);
    console.log(`  Duration/Distance: ${driveTimeDropToYard} min`);
    console.log(`  Total Duration: ${totalJourneyTime.toFixed(2)} min`);
    console.log(`  Amount from pit: ${totalLoadAmount} ${materialInfo.sold_by}`);
    console.log(`  Base Price: $${pit.price}`);
    console.log(`  Final Total: $${totalCost.toFixed(2)}`);
    console.log("===================================");

    let groupedTrucks = {};
    detailedCosts.forEach(load => {
      const key = `${load.truckName}-${load.amount}-${load.costPerUnit.toFixed(2)}`;
      if (!groupedTrucks[key]) {
        groupedTrucks[key] = {
          truckName: load.truckName,
          amount: load.amount,
          costPerUnit: load.costPerUnit,
          count: 1
        };
      } else {
        groupedTrucks[key].count++;
      }
    });

    console.log("  Truck(s):");
    Object.values(groupedTrucks).forEach(truck => {
      console.log(`    - ${truck.count} ${truck.truckName}(s) of ${truck.amount} ${materialInfo.sold_by}s at $${truck.costPerUnit.toFixed(2)} per ${materialInfo.sold_by}`);
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ totalCost, detailedCosts, location: pit, pitLoads, yardLoads, yardCostData })
    };

  } catch (err) {
    console.error("Fatal error in pitCostFunction:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error in pitCostFunction." })
    };
  }
};

