import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography, CardMedia } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import config from '../../config';

const CourseAccordion = ({ course, handleNameClick, getGradientColor }) => {
  return (
    <Accordion sx={{ width: '100%', marginBottom: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
          <CardMedia
            component="img"
            image={course.coverImage ? `${config.API}${course.coverImage}` : '/path/to/Coursepic.jpg'}
            alt="Coursepic"
            sx={{ width: 48, height: 48 }}
          />
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1, ml: 2 }}>
            <Typography
              variant="h6"
              onClick={() => handleNameClick(course.courseName)}
              sx={{ cursor: 'pointer', marginRight: '8px', '&:hover': { color: '#05440A', fontWeight: 'bold' } }}
            >
              {course.courseName}
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="row" textAlign="left" width="100%">
          <Box ml={3} display="flex" flexDirection="column" width="33%">
            <Typography variant="body1">Instructor name: {course.instructor || 'N/A'}</Typography>
            <Typography variant="body2">Days in a week: {course.day || 'N/A'}</Typography>
            <Typography variant="body2">Time: {course.time || 'N/A'}</Typography>
            <Typography variant="body2">Location: {course.classroom || 'N/A'}</Typography>
            <Typography variant="body2">Exam date: {course.examTime || 'N/A'}</Typography>
          </Box>
          <Box ml={3} display="flex" flexDirection="column" width="33%">
            <Typography variant="body1">Student's Attendance</Typography>
            <Typography variant="body2" color="green">Present: {course.attendance.Present || 0} sessions</Typography>
            <Typography variant="body2" color="red">Absent: {course.attendance.Absent || 0} sessions</Typography>
            <Typography variant="body2" color="orange">Tardy: {course.attendance.Tardy || 0} sessions</Typography>
            <Typography variant="body2" color="text.secondary">Noteworthy: {course.attendance.Noteworthy || 0} sessions</Typography>
          </Box>
          <Box ml={3} display="flex" flexDirection="column" spacing={2}>
            <Typography variant="body1">Assignment Submission State</Typography>
            {course.grades.length > 0 ? (
              course.grades.map((grade, idx) => {
                const percentage = Number(grade.grade);
                const color = getGradientColor(percentage);
                return (
                  <Typography key={idx} variant="body2" style={{ color }}>
                    {grade.assignmentName}: {percentage}%
                  </Typography>
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary">
                No assignments found.
              </Typography>
            )}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

CourseAccordion.propTypes = {
  course: PropTypes.object.isRequired,
  handleNameClick: PropTypes.func.isRequired,
  getGradientColor: PropTypes.func.isRequired,
};

export default CourseAccordion;
