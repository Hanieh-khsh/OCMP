const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Ensure MongoDB connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Directory for uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/\s+/g, '_').replace(/[^\w.-]/g, '');
    cb(null, `${Date.now()}_${sanitizedFilename}`);
  }
});

// Multer upload configuration
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, true); // Allow all file types for course materials
  }
});

// Create new endpoint for uploading assignments
router.post('/uploadAssignment', upload.single('assignment'), async (req, res) => {
  const { assignmentName, courseName, studentID, dueDate } = req.body;

  if (!assignmentName || !courseName || !studentID || !req.file) {
    return res.status(400).send('Assignment name, course name, student ID, assignment file, and due date are required.');
  }

  const filePath = `/uploads/${req.file.filename}`;

  try {
    const db = getDb();

    // Save assignment details to the assignments collection
    const newAssignment = {
      assignmentName,
      courseName,
      studentID,
      filePath,
      dueDate: new Date(dueDate), // Save the due date as a Date object
      uploadDate: new Date()
    };

    await db.collection('assignments').insertOne(newAssignment);

    res.status(200).send(`Successfully uploaded assignment: ${assignmentName}`);
  } catch (error) {
    console.error("Error uploading assignment:", error);
    res.status(500).send('Error uploading assignment.');
  }
});

module.exports = router;
