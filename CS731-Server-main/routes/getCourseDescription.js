const express = require('express');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Initialize the database connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to get a course by courseID
router.get('/:courseID/courseDetails', async (req, res) => {
  const { courseID } = req.params;

  try {
    const db = getDb();
    const course = await db.collection('courses').findOne({ courseID });

    // Respond with course details if found
    if (course) {
      res.status(200).json({
        course: course.courseName,
        courseDescription: course.courseDescription
      });
    } else {
      // Handle case where course is not found
      res.status(404).send('Course not found');
    }
  } catch (error) {
    // Handle database retrieval errors
    console.error("Error retrieving course:", error);
    res.status(500).send('Error retrieving course.');
  }
});

// Export the router
module.exports = router;
