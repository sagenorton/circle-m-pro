const { computeYardCosts, computePitCosts } = require('./costFunctions');
const materialData = require('./materialData.json');

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    const body = JSON.parse(event.body);
    const {
      type,               // "yard" or "pit"
      addressInput,       // Drop-off address
      yard,               // Yard object (name, address, price, etc.)
      truckLoadInfo,      // For yard calculations
      pit,                // Pit object
      pitLoads,           // Pit truck loads
      yardLoads = [],     // If doing a split combo
      yardTotalCost = 0,  // Optional, fallback cost for yard portion
      amountNeeded = 0,   // Total needed (for context)
      materialKey,        // Key from materialData.json
      distances = [],     // Pre-fetched distances if available
      suppressLogs = false
    } = body;

    if (!materialKey || !materialData[materialKey]) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Material key '${materialKey}' not found in materialData.` }),
      };
    }

    const materialInfo = materialData[materialKey];

    let result;

    if (type === 'yard') {
      result = await computeYardCosts({
        truckLoadInfo,
        yard,
        distances,
        addressInput,
        materialInfo,
        suppressLogs
      });
    }

    else if (type === 'pit') {
    if (!pit || !pitLoads || !Array.isArray(pitLoads) || pitLoads.length === 0) {
        return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid or missing 'pit' or 'pitLoads' data." })
        };
    }

    const yardLocations = {};
    for (const location of materialInfo.locations) {
        yardLocations[location.name] = location;
    }

    result = await computePitCosts({
        pitLoads,
        pit,
        distances,
        addressInput,
        yardLoads,
        yardTotalCost,
        materialInfo,
        yardLocations,
        amountNeeded,
        suppressLogs
    });
    }

    else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Invalid type '${type}' provided.` }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Optional: configure for production
      },
      body: JSON.stringify(result)
    };

  } catch (err) {
    console.error("Backend Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        details: err.message
      })
    };
  }
};
