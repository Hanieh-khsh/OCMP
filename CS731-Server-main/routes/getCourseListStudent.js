const express = require('express');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Initialize the database connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to get the list of courses for a student
router.get('/getCourseListStudent/:studentID', async (req, res) => {
  const { studentID } = req.params;

  try {
    const db = getDb();

    // Find courses the student is registered in
    const registeredCourses = await db.collection('registeredCourses').find({ studentID }).toArray();

    if (registeredCourses.length === 0) {
      return res.status(404).json({ success: false, message: 'No courses found for the student.' });
    }

    // Extract the course names
    const courseNames = registeredCourses.map(reg => reg.courseName);

    // Find detailed information for these courses
    const courses = await db.collection('courses').find({ courseName: { $in: courseNames } }).toArray();

    if (courses.length === 0) {
      return res.status(404).json({ success: false, message: 'No detailed courses found for the student.' });
    }

    res.status(200).json({ success: true, courses });

  } catch (error) {
    console.error("Error retrieving courses:", error);
    res.status(500).json({ success: false, message: 'Error retrieving courses.' });
  }
});

module.exports = router;
