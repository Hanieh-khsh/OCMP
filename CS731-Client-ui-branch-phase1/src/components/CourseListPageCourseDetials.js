import React from 'react';
import { Typography, Box, Container, Button, Divider, Accordion, AccordionSummary, AccordionDetails, Breadcrumbs, Link } from '@mui/material';
import { EventAvailable, Description, ExpandMore, GetApp, CloudUpload } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import './CourseListPageCourseDetails.css';

const courseDetails = {
  title: 'Human Ergonomics Principles & Anatomies',
  instructor: 'Dr. Daniel Smith',
  schedule: 'Mon 09-11, Wed 11-13',
  location: 'Classroom 311',
  examDate: '28/11/2024',
  gpsRequirements: 'YES',
  image: '/img/human-ergonomics.jpg',
  Description: 'Ergonomics is the scientific discipline concerned with the understanding of interactions among humans and other elements of a system, and the profession that applies theory, principles, data and methods to design in order to optimize human well-being and overall system performance. Anatomy is the branch of morphology concerned with the study of the internal structure of organisms and their parts. Anatomy is a branch of natural science that deals with the structural organization of living things. It is an old science, having its beginnings in prehistoric times. This Course will be provided in 2 chapters, Chapter 1: Human Ergonomics Principles and Chapter 2: Human Anatomies. Assignment1 is related to Chapter 1 and Assignment2 is related to Chapter 2. Students will be required to submit both assignments to be able to attend the exam.',
  numberofsession: '1',
  sessionname: 'title of session1',
  sessionpdf: 'content of session1',
};

const CourseListPageCourseDetails = () => {
  const { courseTitle } = useParams();
  const details = courseDetails;
  const navigate = useNavigate();

  const handleDownload = () => {
    const content = `${details.numberofsession}+${details.sessionname}+${details.sessionpdf}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'session-details.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File uploaded:', file.name);
    }
  };

  return (
    <div className="course-details-page">
      <Box bgcolor="#FFFFFF" mt={3} mb={2} display="flex" alignItems="center" justifyContent="space-between" textAlign="left">
        <Box display="flex" alignItems="center" borderLeft={'5px solid #05440A'} paddingLeft={1} borderRadius={1}>
          <img src="/img/human-ergonomics.jpg" alt="Human Ergonomics Principles & Anatomies" width={80} />
          <Box ml={2}>
            <Typography variant="h4">{details.title}</Typography>
            <Typography variant="subtitle1">Instructed by : {details.instructor}</Typography>
            <Typography variant="subtitle2">{details.schedule} , {details.location}</Typography>
          </Box>
        </Box>
        <Box textAlign="right" padding={2}>
          <Typography variant="h6" color="#05440A">Exam Date : {details.examDate}</Typography>
          <Typography variant="subtitle2" color="#05440A"> Assignment2 due date: 28/10/2024</Typography>
          <Typography variant="subtitle2" color="#05440A"> Assignment1 due date: 28/09/2024</Typography>
        </Box>
      </Box>
      <Container>
        <Box mb={2} textAlign="left">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/courses" onClick={() => navigate('/courses')}>
              Student's Portal
            </Link>
            <Link underline="hover" color="inherit" href="/courses" onClick={() => navigate('/courses')}>
              Course List
            </Link>
            <Typography color="textPrimary">Course Details</Typography>
          </Breadcrumbs>
        </Box>

        <Box className="course-details-description" sx={{ maxWidth: '100%' }}>
          <Box mb={2} textAlign="left">
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography gutterBottom variant="h6" component="div">
                  What will you learn?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {details.Description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>

        <Box mb={2} textAlign="left">
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography gutterBottom variant="h6" component="div">
                What are Course materials?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Button variant="contained" color="primary" startIcon={<GetApp />} sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, textTransform: 'none' }} onClick={handleDownload}>
                {details.numberofsession} {details.sessionname} {details.sessionpdf}
              </Button>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box mb={2} textAlign="left">
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography gutterBottom variant="h6" component="div">
                Want to upload your assignments?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUpload />}
                sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, textTransform: 'none' }}
              >
                Upload Assignments' Material
                <input
                  type="file"
                  name="assignmentMaterial"
                  hidden
                  onChange={handleInputChange}
                />
              </Button>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
    </div>
  );
};

export default CourseListPageCourseDetails;
