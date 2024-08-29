const express = require('express');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to send a message
router.post('/sendMessage', async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  if (!senderId || !receiverId || !message) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const db = getDb();
    const result = await db.collection('messages').insertOne({
      senderId,
      receiverId,
      message,
      timestamp: new Date()
    });

    res.status(201).send(`Message sent with ID: ${result.insertedId}`);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send('Error sending message.');
  }
});

// Endpoint to get messages between two users
router.get('/getMessages', async (req, res) => {
  const { userId1, userId2 } = req.query;

  if (!userId1 || !userId2) {
    return res.status(400).send('Both user IDs are required.');
  }

  try {
    const db = getDb();
    const messages = await db.collection('messages')
      .find({
        $or: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 }
        ]
      })
      .sort({ timestamp: 1 })
      .toArray();

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).send('Error retrieving messages.');
  }
});

module.exports = router;
