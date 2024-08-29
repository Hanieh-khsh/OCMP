import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Breadcrumbs, Link, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails, Avatar, Button, TextField, Input, List, ListItem, ListItemText, IconButton
} from '@mui/material'; // Updated import to include IconButton
import { ExpandMore, Favorite, GetApp } from '@mui/icons-material'; // Ensure GetApp is imported
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FullScreenLoader from '../components/loader.js';
import CourseHeader from '../components/CourseHeader';
import CourseDescription from '../components/CourseDescription';
import CourseMaterials from '../components/CourseMaterials';
import useCourseDetails from '../hooks/useCourseDetails';
import '../css/CourseListPageCourseDetails.css';
import config from '../config';

const CourseInstructorCourseDetails = () => {
  const { courseTitle } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const courseID = location.state?.courseName || 'defaultCourseName';

  const { courseDetails, loading, coverImageName, handleEditClick, handleFileChange, handleUpload, handleDownload, handleDelete } = useCourseDetails(courseID);

  const [activeTab, setActiveTab] = useState(0); // Manage active tab
  const [participants, setParticipants] = useState([]); // Store participants data
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false); // Track participant loading
  const [assignments, setAssignments] = useState([]); // Store assignments
  const [isUploading, setIsUploading] = useState(false); // Manage upload form state
  const [newAssignmentName, setNewAssignmentName] = useState(''); // Store new assignment name
  const [newAssignmentFile, setNewAssignmentFile] = useState(null); // Store new assignment file

  useEffect(() => {
    if (activeTab === 0) {
      // Fetch assignments data when the course details tab is active
      const fetchAssignments = async () => {
        try {
          const response = await fetch(`${config.API}/getAssignments/getAssignments?courseName=${courseID}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          if (data.success) {
            setAssignments(data.assignments);
          } else {
            console.error('Failed to fetch assignments data');
          }
        } catch (error) {
          console.error('Error fetching assignments:', error);
        }
      };

      fetchAssignments();
    }
  }, [activeTab, courseID]);

  useEffect(() => {
    if (activeTab === 1 && !participants.length) {
      // Fetch participants data when the participants tab is active
      const fetchParticipants = async () => {
        setIsLoadingParticipants(true);
        try {
          // Fetch registered students for the course
          const response = await fetch(`${config.API}/getRegisteredStudents/getRegisteredStudents/${courseID}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();

          if (data.success) {
            const registeredStudents = data.registeredStudents;

            // Fetch detailed information for each student
            const studentDetailsPromises = registeredStudents.map(student =>
              fetch(`${config.API}/getUser/getUser/${student.studentID}`).then(res => res.json())
            );

            const studentDetails = await Promise.all(studentDetailsPromises);

            const formattedParticipants = registeredStudents.map((student, index) => {
              const details = studentDetails[index];
              return {
                id: student._id,
                name: `${details.firstName} ${details.lastName}` || student.studentID, // Replace with detailed name if available
                major: details.major || 'Undeclared', // Use detailed info if available
                semester: details.semester || 'Unknown', // Use detailed info if available
                attendance: details.attendance || {
                  present: 0, // Placeholder value
                  absent: 0, // Placeholder value
                  tardy: 0, // Placeholder value
                  noteworthy: 0 // Placeholder value
                },
                assignments: details.assignments || {
                  assignment1: 'Not Submitted', // Placeholder value
                  assignment2: 'Not Submitted', // Placeholder value
                  assignment3: 'Not Submitted', // Placeholder value
                  assignment4: 'Not Submitted' // Placeholder value
                },
                avatar: details.avatar || `https://i.pravatar.cc/150?u=${student.studentID}`, // Use detailed avatar if available
                isFollowing: details.isFollowing || false // Placeholder value
              };
            });

            setParticipants(formattedParticipants);
          } else {
            console.error('Failed to fetch participants data');
          }
        } catch (error) {
          console.error('Error fetching participants:', error);
        } finally {
          setIsLoadingParticipants(false);
        }
      };

      fetchParticipants();
    }
  }, [activeTab, courseID, participants.length]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAssignmentNameChange = (e) => {
    setNewAssignmentName(e.target.value);
  };

  const handleAssignmentFileChange = (e) => {
    setNewAssignmentFile(e.target.files[0]);
  };

  const handleAssignmentUpload = async () => {
    if (!newAssignmentName || !newAssignmentFile) {
      alert('Please provide an assignment name and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('assignmentName', newAssignmentName);
    formData.append('courseName', courseID);
    formData.append('studentID', '123'); // Replace with actual student ID if applicable
    formData.append('assignment', newAssignmentFile);

    try {
      const response = await fetch(`${config.API}/uploadAssignment/uploadAssignment`, {
        method: 'POST',
        body: formData,
      });

      // Check the content type of the response
      const contentType = response.headers.get('content-type');

      // Check if the response is JSON
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('Response:', result); // Log the full response

        if (response.ok && result.success) {
          setAssignments(prevAssignments => [...prevAssignments, { name: newAssignmentName, file: result.file }]);
          setNewAssignmentName('');
          setNewAssignmentFile(null);
          setIsUploading(false); // Switch back to the default view
          alert('Assignment uploaded successfully!');
        } else {
          alert(`Failed to upload assignment: ${result.message || 'Unknown error'}`);
        }
      } else {
        // If not JSON, handle it as text
        const resultText = await response.text();
        console.log('Non-JSON response:', resultText);

        if (response.ok && resultText.includes('Successfully uploaded assignment')) {
          setAssignments(prevAssignments => [...prevAssignments, { name: newAssignmentName, file: 'Unknown' }]); // 'Unknown' as placeholder
          setNewAssignmentName('');
          setNewAssignmentFile(null);
          setIsUploading(false); // Switch back to the default view
          alert('Assignment uploaded successfully!');
        } else {
          alert(`Failed to upload assignment. Server responded with: ${resultText}`);
        }
      }
    } catch (error) {
      console.error('Error uploading assignment:', error);
      alert('An error occurred while uploading the assignment.');
    }
  };

  return (
    <div className="course-details-page" style={{ width: '100%', height: '100%' }}>
      {loading && <FullScreenLoader />}
      {!loading && courseDetails && (
        <>
          <CourseHeader
            courseDetails={courseDetails}
            coverImageName={coverImageName}
            onEditClick={handleEditClick}
          />
          <Container style={{ width: '100%', padding: '0' }}>
            <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/courses-instructor" onClick={() => navigate('/')}>
                  Instructor's Portal
                </Link>
                <Link underline="hover" color="inherit" href="/courses-instructor" onClick={() => navigate('/course-list')}>
                  Course List
                </Link>
                <Typography color="textPrimary">Course Details</Typography>
              </Breadcrumbs>
            </Box>

            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
              sx={{ '& .Mui-selected': { fontSize: '18px' } }}
            >
              <Tab label="Course Detail" sx={{ fontSize: '16px', textTransform: 'none' }} />
              <Tab label="Participants' Detail" sx={{ fontSize: '16px', textTransform: 'none' }} />
            </Tabs>

            {activeTab === 0 && (
              <>
                <CourseDescription description={courseDetails.description} />

                <CourseMaterials
                  materials={courseDetails.sessionMaterials}
                  newMaterials={courseDetails.newMaterials}
                  onFileChange={handleFileChange}
                  onUpload={handleUpload}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />

                {/* Assignments Accordion */}
                <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
                  <Accordion sx={{ width: '100%' }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography gutterBottom variant="h6" component="div">
                        Assignments
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {isUploading ? (
                        <Box display="flex" flexDirection="column" spacing={2}>
                          <TextField
                            label="Assignment Name"
                            value={newAssignmentName}
                            onChange={handleAssignmentNameChange}
                            variant="outlined"
                            sx={{ mb: 2 }}
                          />
                          <Input
                            type="file"
                            onChange={handleAssignmentFileChange}
                            sx={{ mb: 2 }}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAssignmentUpload}
                            sx={{ textTransform: 'none', bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}
                          >
                            Upload Assignment
                          </Button>
                          <Button
                            variant="text"
                            color="secondary"
                            onClick={() => setIsUploading(false)}
                            sx={{ mt: 2, textTransform: 'none' }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      ) : (
                        <>
                          <List>
                            {assignments.length > 0 ? (
                              assignments.map((assignment) => (
                                <ListItem key={assignment._id}>
                                  <ListItemText primary={assignment.assignmentName} />
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleDownload(assignment.filePath)}
                                    sx={{ color: '#537756', '&:hover': { color: '#05440A' } }}
                                  >
                                    <GetApp />
                                  </IconButton>
                                </ListItem>
                              ))
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                No assignments uploaded.
                              </Typography>
                            )}
                          </List>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsUploading(true)}
                            sx={{ mt: 2, textTransform: 'none', bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}
                          >
                            Upload Assignment
                          </Button>
                        </>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </>
            )}

            {activeTab === 1 && (
              <Box mt={3}>
                {isLoadingParticipants ? (
                  <FullScreenLoader />
                ) : (
                  participants.length ? participants.map((participant, index) => (
                    <Box key={index} className="course-details-description" sx={{ width: '100%', flexDirection: 'column' }}>
                      <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
                        <Accordion sx={{ width: '100%' }}>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                              <Avatar alt={participant.name} src={participant.avatar} sx={{ width: 48, height: 48 }} />
                              <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>{participant.name}</Typography>
                              <Box textAlign="right" mr={2}>
                                <Button variant="contained" color="primary" startIcon={<Favorite />} sx={{ textTransform: 'none', bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, width: '120px' }}>
                                  {participant.isFollowing ? 'Unfollow' : 'Follow'}
                                </Button>
                              </Box>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box display="flex" alignItems="center" flexDirection="row" spacing={2}>
                              <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                                <Typography variant="body1">Major: {participant.major}</Typography>
                                <Typography variant="body2">Semester: {participant.semester}</Typography>
                              </Box>
                              <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                                <Typography variant="body1">Attendance</Typography>
                                <Typography variant="body2" color="Green">Present: {participant.attendance.present} sessions</Typography>
                                <Typography variant="body2" color="Red">Absent: {participant.attendance.absent} sessions</Typography>
                                <Typography variant="body2" color="Orange">Tardy: {participant.attendance.tardy} sessions</Typography>
                                <Typography variant="body2" color="text.secondary">Noteworthy: {participant.attendance.noteworthy} sessions</Typography>
                              </Box>
                              <Box ml={3} display="flex" flexDirection="column" spacing={2}>
                                <Typography variant="body1">Assignment Status</Typography>
                                <Typography variant="body2" color="Green">Assignment 1: {participant.assignments.assignment1}</Typography>
                                <Typography variant="body2" color="Orange">Assignment 2: {participant.assignments.assignment2}</Typography>
                                <Typography variant="body2" color="Red">Assignment 3: {participant.assignments.assignment3}</Typography>
                                <Typography variant="body2" color="text.secondary">Assignment 4: {participant.assignments.assignment4}</Typography>
                              </Box>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Box>
                    </Box>
                  )) : (
                    <Typography variant="body2" color="textSecondary">No participants registered.</Typography>
                  )
                )}
              </Box>
            )}
          </Container>
        </>
      )}
    </div>
  );
};

export default CourseInstructorCourseDetails;
