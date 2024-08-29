const express = require('express');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Initialize the database connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to get all courses for a user
router.get('/:userID/courses', async (req, res) => {
  const { userID } = req.params;

  try {
    const db = getDb();
    const courses = await db.collection('courses').find({ userID }).toArray();
    // Query to fetch courses where the instructor field matches the userID
    const instructorCourses = await db.collection('courses').find({ studentID: userID }).toArray();

    const allCourses = courses.concat(instructorCourses);

    res.status(200).json(allCourses);
  } catch (error) {
    console.error("Error retrieving courses:", error);
    res.status(500).send('Error retrieving courses.');
  }
});

module.exports = router;
