import React from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const CourseFormFields = ({ formValues, handleChange, coverImageName }) => (
  <>
    <TextField
      label="Type the course name"
      variant="outlined"
      name="courseName"
      value={formValues.courseName}
      onChange={handleChange}
      fullWidth
    />
    <Button
      variant="contained"
      component="label"
      startIcon={<CloudUpload />}
      sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}
    >
      Upload Cover Image
      <input type="file" name="coverImage" hidden onChange={handleChange} />
    </Button>
    {coverImageName && <Typography variant="body2">{`Selected cover image: ${coverImageName}`}</Typography>}
    <TextField
      label="Type the title of 1st Session"
      variant="outlined"
      name="firstSessionTitle"
      value={formValues.firstSessionTitle}
      onChange={handleChange}
      fullWidth
    />
    <TextField
      label="Select days in a week"
      variant="outlined"
      name="day"
      value={formValues.day}
      onChange={handleChange}
      fullWidth
    />
    <TextField
      label="Select time in a day"
      variant="outlined"
      name="time"
      value={formValues.time}
      onChange={handleChange}
      fullWidth
    />
    <TextField
      label="Type Classroom Number"
      variant="outlined"
      name="classroom"
      value={formValues.classroom}
      onChange={handleChange}
      fullWidth
    />
    <TextField
      label="Select the Exam Time"
      variant="outlined"
      name="examTime"
      value={formValues.examTime}
      onChange={handleChange}
      fullWidth
    />
    <TextField
      label="Type the Exam Location"
      variant="outlined"
      name="examLocation"
      value={formValues.examLocation}
      onChange={handleChange}
      fullWidth
    />
    <TextField
      label="Type the Course Description"
      variant="outlined"
      name="description"
      multiline
      rows={4}
      value={formValues.description}
      onChange={handleChange}
      fullWidth
    />
  </>
);

export default CourseFormFields;
