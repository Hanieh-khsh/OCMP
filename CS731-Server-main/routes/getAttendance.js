const express = require('express');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Initialize the database connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Endpoint to get attendance records
router.get('/getAttendance', async (req, res) => {
  const { courseName } = req.query;

  // Validate required fields
  if (!courseName) {
    return res.status(400).json({ success: false, message: 'Course name is required.' });
  }

  try {
    const db = getDb();
    const attendanceRecords = await db.collection('lectureAttendance').find({ courseName }).toArray();

    // Group the records by lecture date
    const groupedAttendance = attendanceRecords.reduce((acc, record) => {
      if (!acc[record.lectureDate]) {
        acc[record.lectureDate] = [];
      }
      acc[record.lectureDate].push({
        studentID: record.studentID,
        status: record.status
      });
      return acc;
    }, {});

    // Transform the grouped data into an array of lectures
    const lectures = Object.keys(groupedAttendance).map(date => ({
      lectureDate: date,
      attendanceList: groupedAttendance[date]
    }));

    res.status(200).json({
      success: true,
      courseName,
      lectures
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ success: false, message: 'Error fetching attendance records.' });
  }
});

module.exports = router;
