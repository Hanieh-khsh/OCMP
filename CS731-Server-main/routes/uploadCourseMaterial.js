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

// Create new endpoint for uploading course materials
router.post('/uploadCourseMaterials', upload.array('courseMaterials', 10), async (req, res) => {
  const { courseName } = req.body;

  if (!courseName || !req.files || req.files.length === 0) {
    return res.status(400).send('Course name and course materials are required.');
  }

  const newMaterialsPaths = req.files.map(file => `/uploads/${file.filename}`);

  try {
    const db = getDb();
    const course = await db.collection('courses').findOne({ courseName });

    if (!course) {
      return res.status(404).send('Course not found.');
    }

    const updatedMaterials = course.sessionMaterials ? course.sessionMaterials.concat(newMaterialsPaths) : newMaterialsPaths;

    await db.collection('courses').updateOne(
      { courseName },
      { $set: { sessionMaterials: updatedMaterials } }
    );

    res.status(200).send(`Successfully uploaded and appended materials to course: ${courseName}`);
  } catch (error) {
    console.error("Error uploading course materials:", error);
    res.status(500).send('Error uploading course materials.');
  }
});

module.exports = router;
