const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Initialize the database connection
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/\s+/g, '_').replace(/[^\w.-]/g, '');
    cb(null, `${Date.now()}_${sanitizedFilename}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.fieldname === 'coverImage' && !['.png', '.jpg', '.jpeg'].includes(ext)) {
      return cb(new Error('Cover Image must be .png, .jpg, or .jpeg format'), false);
    }
    cb(null, true);
  }
});

// Endpoint to edit course details
router.post('/editCourse', upload.single('coverImage'), async (req, res) => {
  const {
    courseName,
    studentID,
    firstSessionTitle,
    day,
    time,
    classroom,
    examTime,
    examLocation,
    description,
    coverImagePath,  // This field will be used if the image already exists
  } = req.body;

  if (!courseName) {
    return res.status(400).send('courseName is required.');
  }

  if (!studentID || !firstSessionTitle || !day || !time || !classroom || !examTime || !examLocation || !description) {
    return res.status(400).send('All fields except the files are required.');
  }

  const coverImage = req.file ? `/uploads/${req.file.filename}` : coverImagePath;

  try {
    const db = getDb();
    const existingCourse = await db.collection('courses').findOne({ courseName: courseName });

    if (!existingCourse) {
      return res.status(404).send('Course not found.');
    }

    const updatedData = {
      studentID,
      courseName,
      firstSessionTitle,
      day,
      time,
      classroom,
      examTime,
      examLocation,
      description,
      ...(coverImage && { coverImage }),  // Only include coverImage if a new one is uploaded or an existing path is provided
    };

    const result = await db.collection('courses').updateOne(
      { courseName: courseName },
      { $set: updatedData }
    );

    if (result.modifiedCount === 0) {
      return res.status(500).send('Failed to update the course.');
    }

    res.status(200).send('Course updated successfully.');
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).send('Error updating course.');
  }
});

module.exports = router;
