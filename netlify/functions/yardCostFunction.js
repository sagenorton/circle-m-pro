const fetch = require("node-fetch");

exports.handler = async function (event) {
  try {
    const {
      truckLoadInfo,
      yard,
      distances,
      addressInput,
      materialInfo,
      suppressLogs = false
    } = JSON.parse(event.body);

    let totalCost = 0;
    let detailedCosts = [];

    // Helper function to fetch distances if not passed in
    async function calculateDistances(routes) {
      const apiKey = process.env.MAPS_API_KEY;
      const fetchPromises = routes.map(route => {
        const origin = encodeURIComponent(route.origin);
        const destination = encodeURIComponent(route.destination);
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${apiKey}`;
        return fetch(url).then(res => res.json());
      });

      const results = await Promise.all(fetchPromises);
      return results.map((res, i) => {
        const element = res.rows[0].elements[0];
        return {
          from: routes[i].origin,
          to: routes[i].destination,
          distance: element.distance.text,
          duration: Math.ceil(element.duration.value / 60)
        };
      });
    }

    // Fallback: fetch distances if none provided
    let localDistances = distances;
    if (!localDistances || localDistances.length === 0) {
      if (!suppressLogs) {
        console.warn(`No distances found for ${yard.name}. Fetching new distances.`);
      }

      if (!addressInput) {
        if (!suppressLogs) {
          console.error("ERROR: addressInput is missing! Cannot fetch distances.");
        }
        return {
          statusCode: 200,
          body: JSON.stringify({ totalCost: Infinity, detailedCosts: [], location: yard })
        };
      }

      localDistances = await calculateDistances([{ origin: yard.address, destination: addressInput }]);

      if (!localDistances || localDistances.length === 0) {
        if (!suppressLogs) {
          console.error(`ERROR: No valid distances retrieved for ${yard.name}.`);
        }
        return {
          statusCode: 200,
          body: JSON.stringify({ totalCost: Infinity, detailedCosts: [], location: yard })
        };
      }
    }

    // Determine drive time
    if (!yard.initialDriveTime) {
      let driveTimeEntry = localDistances.find(d =>
        d.from.trim().toLowerCase() === yard.address.trim().toLowerCase() ||
        d.to.trim().toLowerCase() === yard.address.trim().toLowerCase()
      );

      if (!driveTimeEntry) {
        if (!suppressLogs) {
          console.error(`ERROR: Could not find matching drive time for yard ${yard.name}`);
        }
        return {
          statusCode: 200,
          body: JSON.stringify({ totalCost: Infinity, detailedCosts: [], location: yard })
        };
      }

      yard.initialDriveTime = driveTimeEntry.duration;
    }

    let driveTime = yard.initialDriveTime;

    if (!truckLoadInfo || !Array.isArray(truckLoadInfo) || truckLoadInfo.length === 0) {
      if (!suppressLogs) {
        console.error(`ERROR: No valid truck loads for ${yard.name}.`);
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ totalCost: Infinity, detailedCosts: [], location: yard })
      };
    }

    for (let load of truckLoadInfo) {
      if (!load.amount || !load.rate || isNaN(load.amount) || isNaN(load.rate)) {
        if (!suppressLogs) {
          console.warn("Skipping invalid load data:", load);
        }
        continue;
      }

      let costPerUnit = (((((driveTime * 2 * 1.15) + 36) / 60) * load.rate) / (load.amount || 1)) + (yard.price || 0);

      if (isNaN(costPerUnit) || !isFinite(costPerUnit)) {
        if (!suppressLogs) {
          console.error(`ERROR: Invalid costPerUnit for ${load.truckName}. Defaulting to $0.`);
        }
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
    }

    if (isNaN(totalCost) || totalCost === 0) {
      if (!suppressLogs) {
        console.error(`ERROR: Total Cost calculation failed for yard ${yard.name}. Returning 'Infinity'.`);
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ totalCost: Infinity, detailedCosts: [], location: yard })
      };
    }

    if (!suppressLogs) {
      console.log("===================================");
      console.log("Yard Calculation:");
      console.log(`Yard Chosen: ${yard.name}, ${yard.address}`);
      console.log(`Base Price: $${yard.price}`);
      console.log(`Duration to Drop Off: ${driveTime} min`);
      console.log(`Round Trip Duration: ${(driveTime * 2).toFixed(2)} min`);
      console.log(`Number of Trips: ${truckLoadInfo.length}`);
      console.log(`Total Duration: ${(truckLoadInfo.length * driveTime * 2).toFixed(2)} min`);
    }

    let groupedTrucks = {};
    truckLoadInfo.forEach(load => {
      const truckGroupKey = `${load.truckName}-${load.amount}-${load.rate}`;
      if (!groupedTrucks[truckGroupKey]) {
        groupedTrucks[truckGroupKey] = {
          count: 0,
          amount: load.amount,
          costPerUnit: (((driveTime * 2 * 1.15 + 36) / 60 * load.rate) / load.amount + yard.price),
          truckName: load.truckName
        };
      }
      groupedTrucks[truckGroupKey].count++;
    });

    if (!suppressLogs) {
      Object.values(groupedTrucks).forEach(truck => {
        console.log(`  • ${truck.count} ${truck.truckName}(s) of ${truck.amount} ${materialInfo.sold_by}s at $${truck.costPerUnit.toFixed(2)} per ${materialInfo.sold_by}`);
      });

      console.log(`\nFinal Total: $${totalCost.toFixed(2)}`);
      console.log("===================================");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ totalCost, detailedCosts, location: yard })
    };
  } catch (error) {
    console.error("Fatal error in yardCostFunction:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error in yardCostFunction." })
    };
  }
};
