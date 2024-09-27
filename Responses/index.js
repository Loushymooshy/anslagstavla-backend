function sendResponse(response) {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
}

function sendError(statusCode, errorMessage) {
  return {
    statusCode,
    body: JSON.stringify({ errorMessage }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
}

module.exports = { sendResponse, sendError };

// Comment