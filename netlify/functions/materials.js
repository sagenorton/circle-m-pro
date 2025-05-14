const materialData = require('./materialData.json');

exports.handler = async function (event) {
  const { material } = event.queryStringParameters;

  if (!material || !materialData[material]) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: `Material '${material}' not found.` })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Allow frontend to access
    },
    body: JSON.stringify(materialData[material])
  };
};
