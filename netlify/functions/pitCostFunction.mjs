import fetch from 'node-fetch';

export async function handler(event) {
  try {
    const {
      pitLoads,
      pit,
      distances,
      addressInput,
      yardLoads = [],
      yardTotalCost,
      materialInfo = {},
      amountNeeded,
      yardLocations = {},
    } = JSON.parse(event.body);

    // Ensure these values are defined to prevent errors
    yardTotalCost = yardTotalCost || 0;
    materialInfo = materialInfo || {};
    amountNeeded = amountNeeded || 0;

    if (!pitLoads || !pit || !distances || !materialInfo) {
      throw new Error("Missing required input fields.");
    }

    if (pitLoads.length === 0) {
      console.error(`ERROR: No valid pit truck loads found for ${pit.name}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ totalCost: Infinity })
      };
    }

    const apiKey = process.env.MAPS_API_KEY;

    // Get closest yard to drop-off location
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
        return;
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

    lastJourneyTime = totalJourneyTime;

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

    if (yardLoads.length > 0) {
        console.log(`Processing overflow yard loads separately to ensure correct yard calculation.`);
    
        let assignedYard = materialInfo.locations.find(yard => yard.name === finalClosestYard);
        if (!assignedYard) {
            console.error(`ERROR: Could not find assigned yard (${finalClosestYard}) in material locations.`);
            return { totalCost: Infinity, detailedCosts: [], location: pit, pitLoads, yardLoads };
        }
    
        // Compute distances for yard separately
        let yardDistances = await calculateDistances([{ origin: assignedYard.address, destination: addressInput }]);
    
        // Ensure correct yard pricing is used
        let yardCostData = await computeYardCosts(yardLoads, assignedYard, yardDistances, addressInput, materialInfo);
    
        detailedCosts = detailedCosts.concat(yardCostData.detailedCosts);
        totalCost += yardCostData.totalCost;
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

    // Group trucks
    let groupedTrucks = {};
    pitLoads.forEach(load => {
        const truckGroupKey = `${load.truckName}-${load.amount}-${load.rate}`;
        if (!groupedTrucks[truckGroupKey]) {
            groupedTrucks[truckGroupKey] = {
                count: 0,
                amount: load.amount,
                costPerUnit: (((totalJourneyTime / 60) * load.rate) / totalLoadAmount) + (pit.price || 0),
                truckName: load.truckName
            };
        }
        groupedTrucks[truckGroupKey].count++;
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        totalCost,
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


