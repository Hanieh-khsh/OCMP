const express = require('express');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Initialize the database connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to get user data using GET request
router.get('/getUser/:studentID', async (req, res) => {
  const { studentID } = req.params;

  if (!studentID) {
    return res.status(400).send('Student ID is required.');
  }

  try {
    const db = getDb();
    const user = await db.collection('users').findOne({ id: studentID });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    // Exclude the password from the response for security reasons
    const { password, ...userData } = user;

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).send('Error retrieving user data.');
  }
});

module.exports = router;
