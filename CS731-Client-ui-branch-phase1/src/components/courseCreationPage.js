import React, { useState } from 'react';
import { Container, Box, TextField, Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Modal } from '@mui/material';
import './CourseCreationPage.css'; 

const CourseCreationPage = () => {
  const [courseDetails, setCourseDetails] = useState({
    courseID: '', 
    courseName: '',
    courseDescription: '', 
    instructor: '',
    schedule: '',
    location: '',
    examDate: '',
    gpsRequirement: '',
    image: null,
  });

  const [open, setOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails({
      ...courseDetails,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setCourseDetails({
      ...courseDetails,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in courseDetails) {
      formData.append(key, courseDetails[key]);
    }

    try {
      const response = await fetch('http://204.83.75.184:8080/createCourse/createCourse', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setModalMessage('Course created successfully!');
        setOpen(true);
        
        setCourseDetails({
          courseID: '',
          courseName: '',
          courseDescription: '',
          instructor: '',
          schedule: '',
          location: '',
          examDate: '',
          gpsRequirement: '',
          image: null,
        });
      } else {
        const message = await response.text();
        setModalMessage(`Failed to create course: ${message}`);
        setOpen(true);
      }
    } catch (error) {
      setModalMessage(`Error: ${error.message}`);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="md" className="course-creation-container">
      <Box className="course-creation-header">
        <Typography variant="h4">Create a New Course</Typography>
      </Box>
      <form onSubmit={handleSubmit} className="course-creation-form">
        <Grid container spacing={3} className="form-grid">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Course ID"
              name="courseID"
              variant="outlined"
              value={courseDetails.courseID}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Course Name"
              name="courseName"
              variant="outlined"
              value={courseDetails.courseName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Course Description"
              name="courseDescription"
              variant="outlined"
              value={courseDetails.courseDescription}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Instructor Name"
              name="instructor"
              variant="outlined"
              value={courseDetails.instructor}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Schedule"
              name="schedule"
              variant="outlined"
              value={courseDetails.schedule}
              onChange={handleChange}
              required
              placeholder="E.g., Mon 09-11, Wed 11-13"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              variant="outlined"
              value={courseDetails.location}
              onChange={handleChange}
              required
              placeholder="E.g., Classroom 311"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Exam Date"
              name="examDate"
              variant="outlined"
              value={courseDetails.examDate}
              onChange={handleChange}
              required
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" required>
              <InputLabel id="gps-requirement-label">GPS Requirements</InputLabel>
              <Select
                labelId="gps-requirement-label"
                label="GPS Requirements"
                name="gpsRequirement"
                value={courseDetails.gpsRequirement}
                onChange={handleChange}
              >
                <MenuItem value="YES">YES</MenuItem>
                <MenuItem value="NO">NO</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              color="primary"
              className="upload-button"
            >
              Upload Course Image
              <input
                type="file"
                hidden
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {courseDetails.image && <Typography mt={2} className="file-name">{courseDetails.image.name}</Typography>}
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="submit-button"
            >
              Create Course
            </Button>
          </Grid>
        </Grid>
      </form>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-content" sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modalMessage.includes('successfully') ? 'Success' : 'Error'}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {modalMessage}
          </Typography>
          <Button onClick={handleClose} color="primary" variant="contained" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default CourseCreationPage;
