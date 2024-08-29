const express = require('express');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Ensure MongoDB connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to grade an assignment
router.post('/gradeAssignment', async (req, res) => {
  const { courseID, assignmentName, grades } = req.body;

  // Validate input
  if (!courseID || !assignmentName || !grades) {
    return res.status(400).send('Course ID, assignment name, and grades are required.');
  }

  try {
    const db = getDb();

    // Convert grades object to array of student grade objects
    const gradeEntries = Object.entries(grades).map(([studentID, grade]) => ({
      courseID,
      assignmentName,
      studentID,
      grade,
    }));

    // Iterate through grade entries and upsert (update or insert) each grade
    for (const { studentID, grade } of gradeEntries) {
      await db.collection('assignmentGrades').updateOne(
        { courseID, assignmentName, studentID },
        { $set: { grade } },
        { upsert: true }
      );
    }

    res.status(201).send(`Grades for assignment "${assignmentName}" updated successfully.`);
  } catch (error) {
    console.error("Error grading assignment:", error);
    res.status(500).send('Error grading assignment.');
  }
});

module.exports = router;
