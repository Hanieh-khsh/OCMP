import React from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, Avatar, Grid } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

export const getGradientColor = (percentage) => {
  // Adjust maximum RGB values for better contrast
  const maxR = 220; // Darker red
  const maxG = 220; // Darker green
  const minR = 30;  // Minimum red value to avoid blending with white
  const minG = 30;  // Minimum green value to avoid blending with white

  const r = Math.max(minR, Math.min(maxR, Math.round((maxR * (100 - percentage)) / 100)));
  const g = Math.max(minG, Math.min(maxG, Math.round((maxG * percentage) / 100)));
  const b = 0;

  return `rgb(${r}, ${g}, ${b})`;
};


const ParticipantsSection = ({ participants }) => (
  <Box mt={3}>
    {participants.length ? participants.map((participant, index) => (
      <Box key={index} className="course-details-description" sx={{ width: '100%', flexDirection: 'column' }}>
        <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                <Avatar alt={participant.name} src={participant.avatar} sx={{ width: 48, height: 48 }} />
                <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>{participant.name}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="body1">Major: {participant.major}</Typography>
                    <Typography variant="body2">Semester: {participant.semester}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="body1">Attendance</Typography>
                    <Typography variant="body2" color="Green">
                      Present: {participant.attendance.filter(att => att.status === 'Present').length}{" "}
                      {participant.attendance.filter(att => att.status === 'Present').length === 1 ? 'lecture' : 'lectures'}
                    </Typography>
                    <Typography variant="body2" color="Red">
                      Absent: {participant.attendance.filter(att => att.status === 'Absent').length}{" "}
                      {participant.attendance.filter(att => att.status === 'Absent').length === 1 ? 'lecture' : 'lectures'}
                    </Typography>
                    <Typography variant="body2" color="Orange">
                      Late: {participant.attendance.filter(att => att.status === 'Tardy').length}{" "}
                      {participant.attendance.filter(att => att.status === 'Tardy').length === 1 ? 'lecture' : 'lectures'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Noteworthy: {participant.attendance.filter(att => att.status === 'Noteworthy').length}{" "}
                      {participant.attendance.filter(att => att.status === 'Noteworthy').length === 1 ? 'lecture' : 'lectures'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="body1">Assignment Submission State</Typography>
                    {Object.entries(participant.assignments).map(([assignmentName, grade], idx) => {
                      const percentage = Number(grade);
                      const color = getGradientColor(percentage);
                      return (
                        <Typography key={idx} variant="body2" style={{ color }}>
                          {assignmentName}: {percentage}%
                        </Typography>
                      );
                    })}
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    )) : (
      <Typography variant="body2" color="textSecondary">No participants registered.</Typography>
    )}
  </Box>
);

export default ParticipantsSection;
