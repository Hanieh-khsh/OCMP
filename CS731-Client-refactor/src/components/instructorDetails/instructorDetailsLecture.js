import React from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, Avatar, Button, FormControl, Select, MenuItem } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const LecturesSection = ({ lectures, participants, onAttendanceChange, onSaveAttendance, onAddLecture }) => (
  <Box mt={3} sx={{ textAlign: 'left', width: '100%' }}>
    <Button
      variant="contained"
      color="primary"
      onClick={onAddLecture}
      sx={{ mb: 2, textTransform: 'none', bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}
    >
      Add Lecture
    </Button>
    {lectures.map((lecture, index) => (
      <Accordion key={index} sx={{ width: '100%', mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography gutterBottom variant="h6" component="div">
            Lecture on {new Date(lecture.lectureDate).toLocaleDateString()}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {lecture.attendanceList && lecture.attendanceList.length > 0 ? lecture.attendanceList.map(student => {
              const participant = participants.find(p => p.id === student.studentID);
              return (
                <ListItem key={student.studentID}>
                  <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                    <Avatar alt={participant?.name || 'Unknown'} src={participant?.avatar || 'https://i.pravatar.cc/150'} sx={{ width: 48, height: 48 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>{participant ? participant.name : 'Unknown'}</Typography>
                    <FormControl sx={{ minWidth: 120, ml: 3 }}>
                      <Select
                        value={student.status}
                        onChange={(e) => onAttendanceChange(index, student.studentID, e.target.value)}
                      >
                        <MenuItem value="Present">Present</MenuItem>
                        <MenuItem value="Absent">Absent</MenuItem>
                        <MenuItem value="Tardy">Tardy</MenuItem>
                        <MenuItem value="Noteworthy">Noteworthy</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </ListItem>
              );
            }) : (
              <Typography variant="body2" color="textSecondary">
                No attendance records available.
              </Typography>
            )}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSaveAttendance(index)}
            sx={{ mt: 2, textTransform: 'none', bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}
          >
            Save Attendance
          </Button>
        </AccordionDetails>
      </Accordion>
    ))}
  </Box>
);

export default LecturesSection;
