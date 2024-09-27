require('dotenv').config();

const { sendError, sendResponse } = require('../../Responses/index');
const { db } = require('../../Services/db');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');

module.exports.handler = async (event) => {
  try {
    const params = {
      TableName: process.env.TABLE_NAME,
    };

    try {
      const data = await db.send(new ScanCommand(params));
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