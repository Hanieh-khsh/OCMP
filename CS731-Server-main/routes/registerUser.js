const express = require('express');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Initialize the database connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to register students to courses
router.post('/registerUser', async (req, res) => {
  const { courseName, studentIDs } = req.body;

  // Validate required fields
  if (!courseName || !Array.isArray(studentIDs) || studentIDs.length === 0) {
    return res.status(400).json({ success: false, message: 'Course name and an array of student IDs are required.' });
  }

  try {
    const db = getDb();
    const registrations = studentIDs.map(studentID => ({
      courseName,
      studentID,
      registrationDate: new Date() // Adding a timestamp for when the student was registered
    }));

    // Insert the registration data into the `registeredCourses` collection
    const result = await db.collection('registeredCourses').insertMany(registrations);

    res.status(201).json({
      success: true,
      message: `${result.insertedCount} students registered to course ${courseName}`
    });
  } catch (error) {
    console.error("Error registering students:", error);
    res.status(500).json({ success: false, message: 'Error registering students.' });
  }
});

module.exports = router;
