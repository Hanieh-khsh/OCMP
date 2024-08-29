const express = require('express');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Initialize the database connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to get course data where courseID equals courseName
router.get('/:courseID', async (req, res) => {
  const { courseID } = req.params;

  try {
    const db = getDb();
    // Query the database where courseID equals courseName
    const course = await db.collection('courses').findOne({ courseName: courseID });

    if (!course) {
      return res.status(404).send('Course not found.');
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error retrieving course data:", error);
    res.status(500).send('Error retrieving course data.');
  }
});

module.exports = router;
