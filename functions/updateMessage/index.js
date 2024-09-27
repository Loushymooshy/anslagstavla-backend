require('dotenv').config();

const { sendError, sendResponse } = require('../../Responses/index');
const { db } = require('../../Services/db');
const { UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

module.exports.handler = async (event) => {
  try {
    const { id, text } = JSON.parse(event.body);

    if (!id || !text) {
      return sendError(400, 'ID and text are required');
    }

    // Kontrollera om meddelandet existerar
    const getParams = {
      TableName: process.env.TABLE_NAME,
      Key: { id },
    };

    try {
      const getData = await db.send(new GetCommand(getParams));
      if (!getData.Item) {
        return sendError(404, 'Message not found');
      }
    } catch (error) {
      console.error(error);
      return sendError(500, 'Could not retrieve message');
    }

    const updateParams = {
      TableName: process.env.TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set #text = :text',
      ExpressionAttributeNames: {
        '#text': 'text',
      },
      ExpressionAttributeValues: {
        ':text': text,
      },
      ReturnValues: 'ALL_NEW',
    };

    try {
      const data = await db.send(new UpdateCommand(updateParams));
      return sendResponse(data.Attributes);
    } catch (error) {
      console.error(error);
      return sendError(500, 'Could not update message');
    }
  } catch (error) {
    console.error(error);
    return sendError(400, 'Invalid request body');
  }
};