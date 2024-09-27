require('dotenv').config();

const { sendError, sendResponse } = require('../../Responses/index');
const { db } = require('../../Services/db');
const { DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = process.env.TABLE_NAME;

module.exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    const createdAt = new Date().toISOString();
    const params = {
        TableName: TABLE_NAME,
        Key: {
          id: id,
        },
      };
    try {
      await db.send(new DeleteCommand(params));
      return sendResponse({ id, username, text, createdAt });
    } catch (error) {
      console.error(error);
      return sendError(500, 'Could not create message');
    }
  } catch (error) {
    console.error(error);
    return sendError(400, 'Invalid request body');
  }
};