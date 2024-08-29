const express = require('express');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Initialize the database connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to get all students
router.get('/getAllStudents', async (req, res) => {
  try {
    const db = getDb();
    const students = await db.collection('users').find({ position: 'Student' }).toArray();
    res.status(200).json(students);
  } catch (error) {
    console.error("Error retrieving students:", error);
    res.status(500).send('Error retrieving students.');
  }
});

// Export the router
module.exports = router;
