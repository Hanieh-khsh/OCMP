const express = require('express');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Ensure MongoDB connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Create new endpoint for retrieving assignments
router.get('/getAssignments', async (req, res) => {
  const { courseName, studentID } = req.query;

  try {
    const db = getDb();
    let query = {};

    if (courseName) {
      query.courseName = courseName;
    }

    if (studentID) {
      query.studentID = studentID;
    }

    const assignments = await db.collection('assignments').find(query).sort({ uploadDate: -1 }).toArray(); // Retrieve all assignments sorted by uploadDate in descending order

    

    if (assignments.length === 0) {
      return res.status(404).send('No assignments found.');
    }

    res.status(200).json({ success: true, assignments });
  } catch (error) {
    console.error("Error retrieving assignments:", error);
    res.status(500).send('Error retrieving assignments.');
  }
});

module.exports = router;
