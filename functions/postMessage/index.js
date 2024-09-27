require('dotenv').config();

const { v4: uuidv4 } = require('uuid');
const { sendError, sendResponse } = require('../../Responses/index');
const { db } = require('../../Services/db');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');

module.exports.handler = async (event) => {
  try {
    const { username, text } = JSON.parse(event.body);
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id: id,
        username: username,
        text: text,
        createdAt: createdAt,
      },
    };

    try {
      await db.send(new PutCommand(params));
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