import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import config from '../../config';

const CourseHeader = ({ courseDetails, coverImageName, onEditClick }) => {
  return (
    <Box
      bgcolor="#FFFFFF"
      mt={3}
      mb={2}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      textAlign="left"
    >
      <Box
        display="flex"
        alignItems="center"
        borderLeft="5px solid #05440A"
        paddingLeft={1}
        borderRadius={1}
        sx={{ flexGrow: 1 }}
      >
        <img
          src={courseDetails.coverImage ? `${config.API}${courseDetails.coverImage}` : '/img/default-course.jpg'}
          alt={courseDetails.courseName}
          width={80}
        />
        <Box ml={2}>
          <Typography variant="h4">{courseDetails.courseName}</Typography>
          <Typography variant="subtitle1">Instructed by: {courseDetails.instructorName || 'Loading...'}</Typography>
          <Typography variant="subtitle2">{courseDetails.day}, {courseDetails.time}</Typography>
        </Box>
      </Box>
      <Box textAlign="right" padding={2} display="flex" alignItems="center">
        <Box display="flex" flexDirection="column">
          <Typography variant="h6" color="#05440A">
            Exam Date: {courseDetails.examTime}
          </Typography>
          <Typography variant="subtitle2" color="#05440A">
            Exam Location: {courseDetails.examLocation}
          </Typography>
        </Box>
        <IconButton
          aria-label="edit"
          sx={{ color: '#537756', '&:hover': { color: '#05440A' }, ml: 2 }}
          onClick={onEditClick}
        >
          <Edit />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CourseHeader;
