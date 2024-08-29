const express = require('express');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Ensure MongoDB connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to retrieve grades for a specific student
router.get('/getGrade', async (req, res) => {
  const { courseID, assignmentName, studentID } = req.query;

  // Validate input
  if (!courseID || !studentID) {
    console.error('Validation failed: courseID or studentID missing.');
    return res.status(400).send('Course ID and student ID are required.');
  }

  try {
    const db = getDb();

    if (!db) {
      console.error('Database connection not established.');
      return res.status(500).send('Database connection error.');
    }

    // Log input parameters for debugging
    console.log('Received query parameters:', req.query);

    // Build the query object
    let query = {
      courseID: courseID.trim(), // Trim any extra spaces
      studentID: studentID.trim() // Ensure studentID is also trimmed
    };

    if (assignmentName) {
      query.assignmentName = assignmentName.trim();
    }

    // Log the constructed query object
    console.log('Constructed query:', query);

    // Retrieve the grades for the specified criteria
    const gradeEntries = await db.collection('assignmentGrades')
      .find(query, { projection: { grade: 1, assignmentName: 1, _id: 0 } })
      .toArray();

    // Log the query result
    console.log('Grade entries:', gradeEntries);

    if (gradeEntries.length > 0) {
      res.status(200).json({ grades: gradeEntries });
    } else {
      console.warn('No grades found for the given criteria.');
      res.status(404).send('No grades found for the given criteria.');
    }
  } catch (error) {
    console.error("Error retrieving grades:", error);
    res.status(500).send('Error retrieving grades.');
  }
});

module.exports = router;
