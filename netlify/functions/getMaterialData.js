const materialData = require('./materialData.json');

exports.handler = async function (event) {
  const params = event.queryStringParameters || {};
  const { material } = params;

  // If a specific material is requested
  if (material) {
    if (!materialData[material]) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: `Material '${material}' not found.` })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(materialData[material])
    };
  }

  // If no material is specified, return all material data
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(materialData)
  };
};

