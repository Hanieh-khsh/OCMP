const express = require('express');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Initialize the database connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to record lecture attendance
router.post('/recordAttendance', async (req, res) => {
  const { courseName, lectureDate, attendanceList } = req.body;

  // Validate required fields
  if (!courseName || !lectureDate || !Array.isArray(attendanceList) || attendanceList.length === 0) {
    return res.status(400).json({ success: false, message: 'Course name, lecture date, and an attendance list are required.' });
  }

  try {
    const db = getDb();
    const attendanceRecords = attendanceList.map(student => ({
      courseName,
      lectureDate,
      studentID: student.studentID,
      status: student.status,
      recordedAt: new Date() // Timestamp when the attendance was recorded
    }));

    // Iterate over attendance records to check if they exist and update or insert accordingly
    for (const record of attendanceRecords) {
      const query = {
        courseName: record.courseName,
        lectureDate: record.lectureDate,
        studentID: record.studentID
      };

      // Check if the record exists
      const existingRecord = await db.collection('lectureAttendance').findOne(query);

      if (existingRecord) {
        // If the record exists, update the status
        await db.collection('lectureAttendance').updateOne(query, {
          $set: {
            status: record.status,
            recordedAt: record.recordedAt
          }
        });
      } else {
        // If the record does not exist, insert a new record
        await db.collection('lectureAttendance').insertOne(record);
      }
    }

    res.status(201).json({
      success: true,
      message: `Attendance records processed successfully for course ${courseName} on ${lectureDate}.`
    });
  } catch (error) {
    console.error("Error recording attendance:", error);
    res.status(500).json({ success: false, message: 'Error recording attendance.' });
  }
});

module.exports = router;
