const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Initialize the database connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to login a user using POST request
router.post('/login', async (req, res) => {
  const { studentID, password } = req.body;

  // Validate input
  if (!studentID || !password) {
    console.log('Missing studentID or password');
    return res.status(400).send('Student ID and password are required.');
  }

  try {
    const db = getDb();

    // Find user by student ID
    const user = await db.collection('users').findOne({ id: studentID });

    // If user not found, respond with error
    if (!user) {
      console.log(`User with studentID ${studentID} not found`);
      return res.status(401).send('Invalid Student ID or password');
    }

    // Compare password hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // If password matches, respond with success message and user details
    if (isPasswordMatch) {
      console.log(`User ${studentID} logged in successfully`);
      res.status(200).json({
        message: 'Login successful',
        studentID: user.id,
        position: user.position
      });
    } else {
      // If password does not match, respond with error
      console.log(`Password mismatch for user ${studentID}`);
      res.status(401).send('Invalid Student ID or password');
    }
  } catch (error) {
    // Handle database or other errors
    console.error("Error logging in user:", error);
    res.status(500).send('Error logging in user.');
  }
});

// Export the router
module.exports = router;
