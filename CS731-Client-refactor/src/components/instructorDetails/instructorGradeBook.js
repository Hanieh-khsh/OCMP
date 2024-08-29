import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { GetApp } from '@mui/icons-material';
import config from '../../config';

const GradeAssignmentModal = ({ open, onClose, assignmentName, assignmentDueDate, courseID }) => {
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    if (open) {
      const fetchParticipants = async () => {
        try {
          const response = await fetch(`${config.API}/getRegisteredStudents/getRegisteredStudents/${courseID}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Participants data:", data);

          if (data.success && data.registeredStudents.length > 0) {
            const participantsWithSubmissions = await Promise.all(
              data.registeredStudents.map(async (student) => {
                try {
                  const userResponse = await fetch(`${config.API}/getUser/getUser/${student.studentID}`);
                  if (!userResponse.ok) {
                    throw new Error(`HTTP error! status: ${userResponse.status}`);
                  }
                  const userDetails = await userResponse.json();
                  console.log(`User details for studentID ${student.studentID}:`, userDetails);

                  const assignmentResponse = await fetch(
                    `${config.API}/getAssignments/getAssignments?courseName=${courseID}&studentID=${student.studentID}`
                  );

                  if (assignmentResponse.status === 404) {
                    console.warn(`No assignments found for studentID ${student.studentID}`);
                    return {
                      ...student,
                      firstName: userDetails.firstName,
                      lastName: userDetails.lastName,
                      hasSubmitted: false,
                      submissionLink: '',
                      uploadDate: '',
                      dueDate: '', // No due date
                    };
                  }

                  if (!assignmentResponse.ok) {
                    throw new Error(`HTTP error! status: ${assignmentResponse.status}`);
                  }

                  const assignmentData = await assignmentResponse.json();
                  console.log(`Assignments for studentID ${student.studentID}:`, assignmentData);

                  const studentAssignment = assignmentData.assignments.find(
                    (assignment) => assignment.assignmentName === assignmentName
                  );

                  return {
                    ...student,
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    hasSubmitted: !!studentAssignment,
                    submissionLink: studentAssignment ? `${config.API}${studentAssignment.filePath}` : '',
                    uploadDate: studentAssignment ? new Date(studentAssignment.uploadDate) : null,
                    dueDate: studentAssignment ? new Date(studentAssignment.dueDate) : null, // Use raw date objects
                  };
                } catch (error) {
                  console.error('Error fetching student details or assignments:', error);
                  return {
                    ...student,
                    firstName: '',
                    lastName: '',
                    hasSubmitted: false,
                    submissionLink: '',
                    uploadDate: null,
                    dueDate: null, // Error case
                  };
                }
              })
            );

            setParticipants(participantsWithSubmissions);
          } else {
            console.warn("No registered students found.");
          }

          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching participants:', error);
          setIsLoading(false);
        }
      };

      fetchParticipants();
    }
  }, [open, courseID, assignmentName]);

  const handleGradeChange = (studentID, grade) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [studentID]: grade,
    }));
  };

  const handleUpdateGrades = async () => {
    try {
      const response = await fetch(`${config.API}/gradeAssignment/gradeAssignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseID,
          assignmentName,
          grades,
        }),
      });

      if (response.ok) {
        alert('Grades updated successfully!');
        onClose();
      } else {
        const result = await response.json();
        alert(`Failed to update grades: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating grades:', error);
      alert('An error occurred while updating the grades.');
    }
  };

  const formattedDueDate = new Date(assignmentDueDate).toLocaleDateString();

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', margin: 'auto', mt: 8, width: '60%' }}>
        <Typography variant="h6">Grade Assignment: {assignmentName}</Typography>
        <Typography variant="h6">Due Date: {formattedDueDate}</Typography>

        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <List>
            {participants.length === 0 ? (
              <Typography>No participants found.</Typography>
            ) : (
              participants.map((participant) => {
                // Parse the dates
                const uploadDate = participant.uploadDate ? new Date(participant.uploadDate) : null;
                const dueDate = new Date(assignmentDueDate);

                // Check for valid dates
                if (isNaN(uploadDate)) {
                  console.error('Invalid upload date:', participant.uploadDate);
                }
                if (isNaN(dueDate)) {
                  console.error('Invalid due date:', assignmentDueDate);
                }

                // Compare the dates
                const isLateSubmission = uploadDate && uploadDate > dueDate;

                return (
                  <ListItem key={participant.studentID} sx={{}}>
                    <ListItemText
                      primary={`${participant.firstName} ${participant.lastName}`}
                      secondary={participant.hasSubmitted ? `Submitted on: ${uploadDate ? uploadDate.toLocaleString() : 'Invalid date'}` : 'No Submission'}
                      secondaryTypographyProps={{ style: { color: isLateSubmission ? 'red' : 'inherit' } }}
                    />
                    {participant.hasSubmitted && (
                      <IconButton
                        onClick={() => window.open(participant.submissionLink, '_blank')}
                        sx={{
                          color: '#537756',
                          '&:hover': {
                            color: '#05440A',
                          },
                        }}
                      >
                        <GetApp />
                      </IconButton>
                    )}
                    <TextField
                      label="Grade"
                      type="number"
                      variant="outlined"
                      size="small"
                      value={grades[participant.studentID] || ''}
                      onChange={(e) => handleGradeChange(participant.studentID, e.target.value)}
                      sx={{ ml: 2 }}
                    />
                  </ListItem>
                );
              })
            )}
          </List>
        )}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} sx={{ mr: 2, textTransform: 'none', color: '#f50057' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateGrades}
            sx={{
              textTransform: 'none',
              bgcolor: '#537756',
              '&:hover': { bgcolor: '#05440A' },
            }}
          >
            Update Grades
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default GradeAssignmentModal;
