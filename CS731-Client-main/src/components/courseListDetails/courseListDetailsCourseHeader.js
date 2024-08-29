import config from '../../config';
import React from 'react';
import { Box, Typography } from '@mui/material';

const CourseHeader = ({ courseDetails }) => (
  <Box bgcolor="#FFFFFF" mt={3} mb={2} display="flex" alignItems="center" justifyContent="space-between" textAlign="left">
    <Box display="flex" alignItems="center" borderLeft={'5px solid #05440A'} paddingLeft={1} borderRadius={1}>
      <img src={`${config.API}${courseDetails.coverImage}`} alt={courseDetails.courseName} width={80} />
      <Box ml={2}>
        <Typography variant="h4">{courseDetails.courseName}</Typography>
        <Typography variant="subtitle1">Student ID: {courseDetails.studentID}</Typography>
        <Typography variant="subtitle2">{courseDetails.day} , {courseDetails.time}</Typography>
        <Typography variant="subtitle2">Instructor: {courseDetails.instructorName || 'Loading...'}</Typography>
      </Box>
    </Box>
    <Box textAlign="right" padding={2}>
      <Typography variant="h6" color="#05440A">Exam Date: {courseDetails.examTime}</Typography>
      <Typography variant="subtitle2" color="#05440A">Exam Location: {courseDetails.examLocation}</Typography>
    </Box>
  </Box>
);

export default CourseHeader;
