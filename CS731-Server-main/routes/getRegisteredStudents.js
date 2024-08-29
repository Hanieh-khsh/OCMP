const express = require('express');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Initialize the database connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to get the list of students registered in a course
router.get('/getRegisteredStudents/:courseName', async (req, res) => {
  const { courseName } = req.params;

  try {
    const db = getDb();

    // Log the incoming courseName
    console.log(`Fetching students for course: ${courseName}`);

    // Find students registered in the specified course
    const registeredStudents = await db.collection('registeredCourses').find({ courseName }).toArray();

    // Log the result from the query
    console.log(`Registered students data:`, registeredStudents);

    if (registeredStudents.length === 0) {
      return res.status(404).json({ success: false, message: 'No students found for the course.' });
    }

    res.status(200).json({ success: true, registeredStudents });
  } catch (error) {
    console.error("Error retrieving students:", error);
    res.status(500).json({ success: false, message: 'Error retrieving students.' });
  }
});

module.exports = router;
