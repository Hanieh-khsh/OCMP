const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Initialize the database connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to add a new user using POST request
router.post('/addUser', async (req, res) => {
  const { firstName, lastName, id, phoneNumber, email, password, position } = req.body;

  // Check that all fields are provided
  if (!firstName || !lastName || !id || !phoneNumber || !email || !password || !position) {
    return res.status(400).send('All fields are required.');
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const db = getDb();
    const result = await db.collection('users').insertOne({
      firstName,
      lastName,
      id,
      phoneNumber,
      email,
      password: hashedPassword, // Store the hashed password
      position // Store the new position field
    });

    res.status(201).send(`User added with ID: ${result.insertedId}`);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send('Error adding user.');
  }
});

// Endpoint to add a new user using GET request
router.get('/addUser', async (req, res) => {
  const { firstName, lastName, id, phoneNumber, email, password, position } = req.query;

  // Check that all fields are provided
  if (!firstName || !lastName || !id || !phoneNumber || !email || !password || !position) {
    return res.status(400).send('All fields are required.');
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const db = getDb();
    const result = await db.collection('users').insertOne({
      firstName,
      lastName,
      id,
      phoneNumber,
      email,
      password: hashedPassword, // Store the hashed password
      position // Store the new position field
    });

    res.status(201).send(`User added with ID: ${result.insertedId}`);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send('Error adding user.');
  }
});

// Endpoint to get users for testing
router.get('/users', async (req, res) => {
  try {
    const db = getDb();
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).send('Error retrieving users.');
  }
});

module.exports = router;
