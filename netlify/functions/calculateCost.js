const fetch = require('node-fetch');

exports.handler = async function (event) {
  try {
    const {
      pitLoads,
      pit,
      distances,
      addressInput,
      yardLoads,
      yardTotalCost,
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
        yardTotalCost,
        materialInfo,
        yardLocations,
        amountNeeded
      })
    });

    const pitResult = await pitResponse.json();

    // Call yard cost function
    const yardResponse = await fetch(`${process.env.URL}/.netlify/functions/yardCostFunction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        truckLoadInfo: yardLoads,
        yard: yardLocations[pitResult?.location?.closest_yard || "I90 Yard"],
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
