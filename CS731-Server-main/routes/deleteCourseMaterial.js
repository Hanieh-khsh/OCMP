const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { connectToMongoDB, getDb, ObjectId } = require('../connection.js');

// Connect to MongoDB and log any connection errors
connectToMongoDB().catch(err => console.error("Failed to connect to MongoDB", err));

//Endpoint to remove a file from a course's session materials
router.post('/removeFile', async (req, res) => {
  const { courseId, filePath } = req.body;

  // Validate input
  if (!courseId || !filePath) {
    return res.status(400).send('Course ID and file path are required.');
  }

  try {
    const db = getDb();

    // Update the course document to remove the file path from sessionMaterials
    const result = await db.collection('courses').updateOne(
      { courseName: courseId }, // Query by course ID
      { $pull: { sessionMaterials: filePath } } // Remove file path from sessionMaterials array
    );

    // Handle case where no document was modified
    if (result.modifiedCount === 0) {
      return res.status(404).send('Course not found or file path not in the sessionMaterials array.');
    }

    // Optionally, delete the file from the filesystem
    const fullFilePath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullFilePath)) {
      fs.unlink(fullFilePath, (err) => {
        if (err) {
          console.error("Error deleting file from filesystem:", err);
        }
      });
    }

    res.status(200).send('File path removed successfully from course materials.');
  } catch (error) {
    console.error("Error removing file from course materials:", error);
    res.status(500).send('Error removing file from course materials.');
  }
});

module.exports = router;
