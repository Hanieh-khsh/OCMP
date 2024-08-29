import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Container, Tabs, Link, Tab, TextField, Button, FormControlLabel, Switch } from '@mui/material';
import { Add, CloudUpload, EventAvailable } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CourseListPageInstructor.css';

const CourseListPageInstructorCourseCreation = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [courseDetails, setCourseDetails] = useState({
    courseName: '',
    coverImage: null, // Change to null
    firstSessionTitle: '',
    sessionMaterial: null, // Change to null
    day: '',
    time: '',
    classroom: '',
    assignmentDueTime: '',
    examTime: '',
    examLocation: '',
    autoAccessible: false,
    manualPresence: false,
    sendArticles: false,
  });
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setCourseDetails({
      ...courseDetails,
      [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value), // Handle file input
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('courseName', courseDetails.courseName);
    formData.append('coverImage', courseDetails.coverImage); // Append file
    formData.append('firstSessionTitle', courseDetails.firstSessionTitle);
    formData.append('sessionMaterial', courseDetails.sessionMaterial); // Append file
    formData.append('day', courseDetails.day);
    formData.append('time', courseDetails.time);
    formData.append('classroom', courseDetails.classroom);
    formData.append('assignmentDueTime', courseDetails.assignmentDueTime);
    formData.append('examTime', courseDetails.examTime);
    formData.append('examLocation', courseDetails.examLocation);
    formData.append('autoAccessible', courseDetails.autoAccessible);
    formData.append('manualPresence', courseDetails.manualPresence);
    formData.append('sendArticles', courseDetails.sendArticles);

    try {
      const response = await fetch('http://204.83.75.184:8080/createCourse/createCourse', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('success')
      } else {
        console.error('Error creating course:', await response.text());
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  return (
    <div className="course-list-page-instructor">
      <Container>
        <Box mt={3}>
          {activeTab === 1 && (
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2} className="course-creation-form">
                <TextField
                  label="Type the course name"
                  variant="outlined"
                  name="courseName"
                  value={courseDetails.courseName}
                  onChange={handleInputChange}
                  fullWidth
                />
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}
                >
                  Upload Cover Image
                  <input
                    type="file"
                    name="coverImage"
                    hidden
                    onChange={handleInputChange}
                  />
                </Button>
                <TextField
                  label="Type the title of 1st Session"
                  variant="outlined"
                  name="firstSessionTitle"
                  value={courseDetails.firstSessionTitle}
                  onChange={handleInputChange}
                  fullWidth
                />
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}
                >
                  Upload Session's Material
                  <input
                    type="file"
                    name="sessionMaterial"
                    hidden
                    onChange={handleInputChange}
                  />
                </Button>
                <Button variant="contained" color="primary" startIcon={<Add />} sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}>
                  Add More Sessions and Proper Materials
                </Button>
                <TextField
                  label="Type a day in a week"
                  variant="outlined"
                  name="day"
                  value={courseDetails.day}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  label="Type time in a day"
                  variant="outlined"
                  name="time"
                  value={courseDetails.time}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  label="Type Classroom Number"
                  variant="outlined"
                  name="classroom"
                  value={courseDetails.classroom}
                  onChange={handleInputChange}
                  fullWidth
                />
                <Button variant="contained" color="primary" startIcon={<Add />} sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}>
                  Add More Sessions in a week
                </Button>
                <TextField
                  label="Type Assignments due time"
                  variant="outlined"
                  name="assignmentDueTime"
                  value={courseDetails.assignmentDueTime}
                  onChange={handleInputChange}
                  fullWidth
                />
                <Button variant="contained" color="primary" startIcon={<Add />} sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}>
                  Add More Assignments
                </Button>
                <TextField
                  label="type the Exam Time"
                  variant="outlined"
                  name="examTime"
                  value={courseDetails.examTime}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  label="type the Exam Location"
                  variant="outlined"
                  name="examLocation"
                  value={courseDetails.examLocation}
                  onChange={handleInputChange}
                  fullWidth
                />

                <Button type="submit" variant="contained" color="primary" sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, width: '50%', display: 'block', mx: 'auto' }}>
                  Create The Course
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Container> 
    </div>
  );
};

export default CourseListPageInstructorCourseCreation;
