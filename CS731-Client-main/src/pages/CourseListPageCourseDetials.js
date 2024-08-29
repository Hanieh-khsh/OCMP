import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import {  useLocation } from 'react-router-dom';
import FullScreenLoader from '../components/shared/loader';
import config from '../config';
import useLocalStorage from '../hooks/useLocalStorage';
import CourseHeader from '../components/courseListDetails/courseListDetailsCourseHeader';
import BreadcrumbsNav from '../components/courseListDetails/cousreListDetailsBreadcrumb';
import CourseTabs from '../components/courseListDetails/courseListDetailsTabs';
import CourseDescription from '../components/shared/CourseDescription';
import CourseMaterials from '../components/courseListDetails/courseListDetailsCourseMaterials';
import AssignmentsSection from '../components/courseListDetails/courseListDetailsAssignment';
import ParticipantsDetail from '../components/courseListDetails/courseListDetailsParticipants';
import '../css/CourseListPageCourseDetails.css';

const CourseListPageCourseDetails = () => {
  const [courseDetails, setCourseDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [breadcrumb, setBreadcrumb] = useState('Course Detail');
  const [studentID] = useLocalStorage('studentID', null);
  const [localStorageAssignments, setLocalStorageAssignments] = useState([]);

  const courseName = location.state?.courseName || "defaultCourseName";

  useEffect(() => {
    const courseID = courseName;

    const fetchCourseData = async () => {
      try {
        setLoading(true);

        const courseResponse = await fetch(`${config.API}/getCourseContent/${courseID}`);
        if (!courseResponse.ok) throw new Error('Network response was not ok');
        const courseData = await courseResponse.json();
        setCourseDetails(courseData);

        const instructorResponse = await fetch(`${config.API}/getUser/getUser/${courseData.studentID}`);
        if (instructorResponse.ok) {
          const instructorData = await instructorResponse.json();
          setCourseDetails((prevDetails) => ({
            ...prevDetails,
            instructorName: `${instructorData.firstName} ${instructorData.lastName}`
          }));
        } else {
          console.error('Failed to fetch instructor data');
        }

        const courseStudentAssignmentsResponse = await fetch(`${config.API}/getAssignments/getAssignments?courseName=${courseID}&studentID=${courseData.studentID}`);
        if (courseStudentAssignmentsResponse.ok) {
          const assignmentData = await courseStudentAssignmentsResponse.json();
          setAssignments(assignmentData.assignments);
        } else {
          console.error('Failed to fetch assignments data for course student');
        }

        const localStorageAssignmentsResponse = await fetch(`${config.API}/getAssignments/getAssignments?courseName=${courseID}&studentID=${studentID}`);
        if (localStorageAssignmentsResponse.ok) {
          const assignmentData = await localStorageAssignmentsResponse.json();
          setLocalStorageAssignments(assignmentData.assignments);
        } else {
          console.error('Failed to fetch assignments data for local storage student');
        }
      } catch (error) {
        console.error('Error fetching course content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseName, studentID]);

  const mapLocalAssignmentsToAssignments = (assignments, localAssignments) => {
    return assignments.map(assignment => {
      const localAssignment = localAssignments.find(local => local.assignmentName === assignment.assignmentName);
      return {
        ...assignment,
        localAssignment
      };
    });
  };

  const enrichedAssignments = mapLocalAssignmentsToAssignments(assignments, localStorageAssignments);

  const handleDownload = (filePath, fileName) => {
    const link = document.createElement('a');
    link.href = `${config.API}${filePath}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = async (event, assignmentId) => {
    const file = event.target.files[0];
    if (file) {
      await handleUpload(file, assignmentId);
    }
  };

  const handleUpload = async (file, assignmentId) => {
    const courseID = courseName;

    if (!studentID) {
      alert('Student ID is not set. Please log in again.');
      return;
    }

    const formData = new FormData();
    formData.append('assignmentName', assignments.find(a => a._id === assignmentId).assignmentName);
    formData.append('courseName', courseID);
    formData.append('studentID', studentID);
    formData.append('assignment', file);

    try {
      const response = await fetch(`${config.API}/uploadAssignment/uploadAssignment`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const uploadedFileName = file.name;

        const updatedAssignments = assignments.map((assignment) => {
          if (assignment._id === assignmentId) {
            return { ...assignment, uploadedFileName };
          }
          return assignment;
        });
        setAssignments(updatedAssignments);
        alert('Assignment uploaded successfully!');
        window.location.reload();
      } else {
        console.error('Failed to upload assignment');
      }
    } catch (error) {
      console.error('Error uploading assignment:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    updateBreadcrumb(newValue);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const formatOnlyDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toDateString(undefined, options);
  };

  const isPastDueDate = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const assignmentDueDate = new Date(dueDate);
    return assignmentDueDate < today;
  };

  const updateBreadcrumb = (tabIndex) => {
    let breadcrumbText;
    switch (tabIndex) {
      case 0:
        breadcrumbText = 'Course Detail';
        break;
      case 1:
        breadcrumbText = 'Participants Detail';
        break;
      default:
        breadcrumbText = 'Course Detail';
    }
    setBreadcrumb(breadcrumbText);
  };

  useEffect(() => {
    updateBreadcrumb(activeTab);
  }, [activeTab]);

  return (
    <div className="course-details-page" style={{ width: '100%', height: '100%' }}>
      {loading && <FullScreenLoader />}
      <CourseHeader courseDetails={courseDetails} />
      <Container style={{ width: '100%', padding: '0' }}>
        <BreadcrumbsNav breadcrumb={breadcrumb} />
        <CourseTabs activeTab={activeTab} handleChange={handleChange} />
        {activeTab === 0 && (
          <Box mt={3} mb={3}>
            <CourseDescription description={courseDetails.description} />
            <Box mt={3} mb={3}>
              <CourseMaterials sessionMaterials={courseDetails.sessionMaterials} handleDownload={handleDownload} />
            </Box>
            <Box mt={3} mb={3}>
              <AssignmentsSection
                assignments={assignments}
                enrichedAssignments={enrichedAssignments}
                handleDownload={handleDownload}
                handleFileChange={handleFileChange}
                isPastDueDate={isPastDueDate}
                formatDate={formatDate}
                formatOnlyDate={formatOnlyDate}
              />
            </Box>
          </Box>
        )}
        {activeTab === 1 && (
          <Box mt={3} mb={3}>
            <ParticipantsDetail />
          </Box>
        )}
      </Container>
    </div>
  );
};

export default CourseListPageCourseDetails;
