require('dotenv').config();

const { sendError, sendResponse } = require('../../Responses/index');
const { db } = require('../../Services/db');
const { QueryCommand } = require('@aws-sdk/lib-dynamodb');

module.exports.handler = async (event) => {
  try {
    const username = event.queryStringParameters.username;

    if (!username) {
      return sendError(400, 'Username is required');
    }

    const params = {
      TableName: process.env.TABLE_NAME,
      IndexName: 'username-index', // Assuming you have a GSI on username
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': username,
      },
    };

    try {
      const data = await db.send(new QueryCommand(params));
      return sendResponse(data.Items);
    } catch (error) {
      console.error(error);
      return sendError(500, 'Could not retrieve messages');
    }
  } catch (error) {
    console.error(error);
    return sendError(400, 'Invalid request');
  }
};