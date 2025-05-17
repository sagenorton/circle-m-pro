import fetch from 'node-fetch';

export async function handler(event) {
  try {
    const {
      pitLoads,
      pit,
      distances,
      addressInput,
      yardLoads,
      totalYardCost,
      materialInfo,
      yardLocations,
      amountNeeded
    } = JSON.parse(event.body);

    // Call pit cost function
    const pitResponse = await fetch(`${process.env.URL}/.netlify/functions/pitCostFunction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pitLoads,
        pit,
        distances,
        addressInput,
        yardLoads,
        totalYardCost,
        materialInfo,
        yardLocations,
        amountNeeded
      })
    });

    const pitResult = await pitResponse.json();

    const closestYardKey = Object.keys(yardLocations).find(key =>
      pitResult?.location?.closest_yard?.toLowerCase().includes(key.toLowerCase())
    );

    if (!closestYardKey || !yardLocations[closestYardKey]) {
      throw new Error(`ERROR: Closest yard '${pitResult?.location?.closest_yard}' not found in yardLocations.`);
    }

    const yard = yardLocations[closestYardKey];

    // Call yard cost function
    const yardResponse = await fetch(`${process.env.URL}/.netlify/functions/yardCostFunction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        truckLoadInfo: yardLoads,
        yard,
        distances,
        addressInput,
        materialInfo
      })
    });

    const yardResult = await yardResponse.json();

    const results = [pitResult, yardResult].filter(r => r && isFinite(r.totalCost));

    if (results.length === 0) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No valid cost results available." })
      };
    }

    // Find the cheapest option
    const cheapest = results.reduce((min, current) =>
      current.totalCost < min.totalCost ? current : min
    );

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cheapest)
    };
  } catch (err) {
    console.error("ERROR in calculateCost backend:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};
