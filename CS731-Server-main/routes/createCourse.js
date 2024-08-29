const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { connectToMongoDB, getDb } = require('../connection.js');

// Connect to MongoDB and log errors if any
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

// Ensure the upload directory exists, create if not
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file storage and handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set upload destination
  },
  filename: (req, file, cb) => {
    // Sanitize and generate unique filename
    const sanitizedFilename = file.originalname.replace(/\s+/g, '_').replace(/[^\w.-]/g, '');
    cb(null, `${Date.now()}_${sanitizedFilename}`);
  }
});

// File filter for specific file types and fields
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Only allow certain image formats for 'coverImage'
    if (file.fieldname === 'coverImage' && (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg')) {
      return cb(new Error('Cover Image must be .png, .jpg, or .jpeg format'), false);
    }
    cb(null, true);
  }
});

// Endpoint to create a course with file upload
router.post('/createCourse', upload.fields([
  { name: 'coverImage', maxCount: 1 }, // Limit to one cover image
  { name: 'sessionMaterials', maxCount: 10 } // Limit to ten session materials
]), async (req, res) => {
  const {
    studentID,
    courseName,
    firstSessionTitle,
    days,
    time,
    classroom,
    examTime,
    examLocation,
    description,
  } = req.body;

  // Ensure all required fields are provided
  if (!studentID || !courseName || !firstSessionTitle || !days || !time || !classroom || !examTime || !examLocation || !description) {
    return res.status(400).send('All fields except the files are required.');
  }

  // Handle file paths for uploads
  const coverImagePath = req.files['coverImage'] ? `/uploads/${req.files['coverImage'][0].filename}` : null;
  const sessionMaterialsPaths = req.files['sessionMaterials'] ? req.files['sessionMaterials'].map(file => `/uploads/${file.filename}`) : [];

  try {
    const db = getDb();
    // Create course object with all data
    const courseData = {
      studentID,
      courseName,
      firstSessionTitle,
      days,
      time,
      classroom,
      examTime,
      examLocation,
      description,
      coverImage: coverImagePath,
      sessionMaterials: sessionMaterialsPaths
    };

    // Insert course data into the database
    const result = await db.collection('courses').insertOne(courseData);
    res.status(201).send(`Course added with ID: ${result.insertedId}`);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).send('Error creating course.');
  }
});

module.exports = router;
