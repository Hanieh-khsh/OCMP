import React, { useState, useEffect } from 'react';
import {
  Container, Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Chip
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FullScreenLoader from '../components/shared/loader'; // Import the loading animation component
import '../css/CourseListPageInstructor.css';
import config from '../config';  // Import the config


const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
/* 
Component for instructors to create a new course.
Includes form fields for various course details, file uploads, and date formatting.
*/
const CourseListPageInstructorCourseCreation = () => {
  // State variables
  const [activeTab, setActiveTab] = useState(1); // Tracks the active tab index
  const [courseDetails, setCourseDetails] = useState({
    courseName: '',
    coverImage: null,
    firstSessionTitle: '',
    sessionMaterials: [],
    days: '', // Store days as a comma-separated string
    time: '',
    classroom: '',
    assignmentDueTime: '',
    examTime: '',
    examLocation: '',
    description: '',
  });
  const [coverImageName, setCoverImageName] = useState(''); // Stores the cover image file name
  const [sessionMaterialsNames, setSessionMaterialsNames] = useState([]); // Stores the names of uploaded session materials
  const [studentID, setStudentID] = useState(''); // Stores the student ID from local storage
  const [loading, setLoading] = useState(false); // Tracks loading state
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Fetch student ID from local storage
    const storedStudentID = localStorage.getItem('studentID');
    if (storedStudentID) {
      setStudentID(storedStudentID);
    }
  }, []);

  // Handle input changes and file uploads
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file' && name === 'sessionMaterials') {
      const fileArray = Array.from(files);
      setCourseDetails((prevDetails) => ({
        ...prevDetails,
        [name]: fileArray,
      }));
      setSessionMaterialsNames(fileArray.map(file => file.name));
    } else if (type === 'file') {
      const file = files ? files[0] : null;
      setCourseDetails((prevDetails) => ({
        ...prevDetails,
        [name]: file,
      }));
      if (name === 'coverImage' && file) {
        setCoverImageName(file.name);
      }
    } else {
      setCourseDetails((prevDetails) => ({
        ...prevDetails,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  // Handle changes in the selected days of the week
  const handleDaysChange = (event) => {
    const { value } = event.target;
    const daysArray = typeof value === 'string' ? value.split(',') : value;
    const daysString = daysArray.filter(day => day).join(', '); // Remove leading commas
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      days: daysString,
    }));
  };

  // Handle deletion of a selected day
  const handleDeleteDay = (dayToDelete) => () => {
    const updatedDays = courseDetails.days
      .split(',')
      .filter(day => day !== dayToDelete)
      .join(',');
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      days: updatedDays,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading animation

    // Format time and date fields
    const formattedTime = formatTime(courseDetails.time);
    const formattedExamTime = formatDateTime(courseDetails.examTime);

    const formData = new FormData();
    formData.append('courseName', courseDetails.courseName);
    formData.append('coverImage', courseDetails.coverImage);
    formData.append('firstSessionTitle', courseDetails.firstSessionTitle);
    courseDetails.sessionMaterials.forEach((file) => {
      formData.append('sessionMaterials', file);
    });
    formData.append('day', courseDetails.days); // Send days as a comma-separated string
    formData.append('time', formattedTime); // Use formatted time
    formData.append('classroom', courseDetails.classroom);
    formData.append('assignmentDueTime', courseDetails.assignmentDueTime);
    formData.append('examTime', formattedExamTime); // Use formatted date-time
    formData.append('examLocation', courseDetails.examLocation);
    formData.append('description', courseDetails.description);
    formData.append('studentID', studentID);

    try {
      const response = await fetch('${config.API}/createCourse/createCourse', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Refresh the page on success
        window.location.reload();
      } else {
        console.error('Error creating course:', await response.text());
      }
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setLoading(false); // Hide loading animation
    }
  };

  return (
    <div className="course-list-page-instructor">
      {loading && <FullScreenLoader />} {/* Conditionally show the loading animation */}
      <Container>
        <Box mt={3}>
          {activeTab === 1 && (
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2} className="course-creation-form">
                {/* Course name input */}
                <TextField
                  label="Type the course name"
                  variant="outlined"
                  name="courseName"
                  value={courseDetails.courseName}
                  onChange={handleInputChange}
                  fullWidth
                />
                {/* Cover image upload */}
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
                {coverImageName && <Typography variant="body2">{`Selected cover image: ${coverImageName}`}</Typography>}
                {/* Session title input */}
                <TextField
                  label="Type the title of 1st Session"
                  variant="outlined"
                  name="firstSessionTitle"
                  value={courseDetails.firstSessionTitle}
                  onChange={handleInputChange}
                  fullWidth
                />
                {/* Session materials upload */}
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}
                >
                  Upload Session's Materials
                  <input
                    type="file"
                    name="sessionMaterials"
                    multiple
                    hidden
                    onChange={handleInputChange}
                  />
                </Button>
                {/* Display selected session materials */}
                {sessionMaterialsNames.length > 0 && (
                  <div>
                    <Typography variant="body2">Selected session materials:</Typography>
                    {sessionMaterialsNames.map((name, index) => (
                      <Typography key={index} variant="body2">{name}</Typography>
                    ))}
                  </div>
                )}
                {/* Days of the week selection */}
                <FormControl fullWidth>
                  <InputLabel>Select days in a week</InputLabel>
                  <Select
                    label="Select days in a week"
                    multiple
                    name="days"
                    value={courseDetails.days ? courseDetails.days.split(',') : []}
                    onChange={handleDaysChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} onDelete={handleDeleteDay(value)} />
                        ))}
                      </Box>
                    )}
                  >
                    {daysOfWeek.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* Time selection */}
                <TextField
                  label="Select time in a day"
                  type="time"
                  variant="outlined"
                  name="time"
                  value={courseDetails.time}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {/* Classroom number input */}
                <TextField
                  label="Type Classroom Number"
                  variant="outlined"
                  name="classroom"
                  value={courseDetails.classroom}
                  onChange={handleInputChange}
                  fullWidth
                />
                {/* Exam time input */}
                <TextField
                  label="Select the Exam Time"
                  type="datetime-local"
                  variant="outlined"
                  name="examTime"
                  value={courseDetails.examTime}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {/* Exam location input */}
                <TextField
                  label="Type the Exam Location"
                  variant="outlined"
                  name="examLocation"
                  value={courseDetails.examLocation}
                  onChange={handleInputChange}
                  fullWidth
                />
                {/* Course description input */}
                <TextField
                  label="Type the Course Description"
                  variant="outlined"
                  name="description"
                  multiline
                  rows={4}
                  value={courseDetails.description}
                  onChange={handleInputChange}
                  fullWidth
                />
                {/* Submit button */}
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

// Helper functions for time and date formatting
const formatTime = (timeStr) => {
  if (!timeStr) return ''; // Handle empty input gracefully

  const [hours, minutes] = timeStr.split(':');
  const hoursInt = parseInt(hours, 10);
  const minutesInt = parseInt(minutes, 10);

  if (isNaN(hoursInt) || isNaN(minutesInt)) {
    console.error('Invalid time string:', timeStr);
    return '';
  }

  const ampm = hoursInt >= 12 ? 'PM' : 'AM';
  const formattedHours = hoursInt % 12 || 12;
  const formattedTime = `${formattedHours}:${String(minutesInt).padStart(2, '0')} ${ampm}`;

  return formattedTime;
};

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return ''; // Handle empty or undefined input gracefully

  const dateObj = new Date(dateTimeStr);

  if (isNaN(dateObj)) {
    console.error('Invalid date string:', dateTimeStr);
    return '';
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedTime = `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;

  return formattedTime;
};
