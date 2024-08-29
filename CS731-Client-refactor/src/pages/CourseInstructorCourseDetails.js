import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FullScreenLoader from '../components/shared/loader';
import CourseDetailsHeader from '../components/shared/CourseHeader';
import BreadcrumbsNav from '../components/instructorDetails/instructorDetailsBreadcrumb';
import TabsNavigation from '../components/instructorDetails/instructorDetailsTabs';
import AssignmentsSection from '../components/instructorDetails/instructorDetailsAssignments';
import ParticipantsSection from '../components/instructorDetails/instructorDetailsParticipants';
import LecturesSection from '../components/instructorDetails/instructorDetailsLecture';
import useCourseDetails from '../hooks/useCourseDetails';
import config from '../config';
import GradeAssignmentModal from '../components/instructorDetails/instructorGradeBook';
import useLocalStorage from '../hooks/useLocalStorage';
import CourseDescription from '../components/shared/CourseDescription';
import CourseMaterials from '../components/instructorDetails/CourseMaterials';

const CourseInstructorCourseDetails = () => {
  const { courseTitle } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const courseID = location.state?.courseName || 'defaultCourseName';

  const { courseDetails, loading, coverImageName, handleEditClick, handleFileChange, handleUpload, handleDownload, handleDelete } = useCourseDetails(courseID);

  const [activeTab, setActiveTab] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignmentName, setSelectedAssignmentName] = useState('');
  const [lectures, setLectures] = useState([]);
  const [studentID] = useLocalStorage('studentID', null);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (activeTab !== 0) return;
      try {
        const response = await fetch(`${config.API}/getAssignments/getAssignments?courseName=${courseID}&studentID=${studentID}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data.success) setAssignments(data.assignments);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, [activeTab, courseID, studentID]);

  useEffect(() => {
    const fetchAttendanceAndParticipants = async () => {
      if (activeTab === 0) return;
      setIsLoadingParticipants(true);
      try {
        const [participantsResponse, attendanceResponse] = await Promise.all([
          fetch(`${config.API}/getRegisteredStudents/getRegisteredStudents/${courseID}`),
          fetchAttendanceData()
        ]);

        if (!participantsResponse.ok || !attendanceResponse) throw new Error('Failed to fetch data');
        const participantsData = await participantsResponse.json();
        const attendanceData = attendanceResponse;

        if (participantsData.success) {
          const registeredStudents = participantsData.registeredStudents;

          const studentDetailsPromises = registeredStudents.map(student =>
            fetch(`${config.API}/getUser/getUser/${student.studentID}`).then(res => res.json())
          );

          const studentDetails = await Promise.all(studentDetailsPromises);

          const gradesPromises = registeredStudents.map(student =>
            fetchGradesForStudent(courseID, student.studentID)
          );

          const gradesData = await Promise.all(gradesPromises);

          const formattedParticipants = registeredStudents.map((student, index) => {
            const details = studentDetails[index];
            const studentGrades = gradesData[index];
            const studentAttendance = attendanceData.reduce((acc, lecture) => {
              const attendanceRecord = lecture.attendanceList.find(a => a.studentID === student.studentID);
              if (attendanceRecord) {
                acc.push({ date: lecture.lectureDate, status: attendanceRecord.status });
              }
              return acc;
            }, []);

            const assignments = {};
            studentGrades.forEach(grade => {
              assignments[grade.assignmentName] = grade.grade;
            });

            return {
              id: student.studentID,
              name: `${details.firstName} ${details.lastName}` || student.studentID,
              major: details.major || 'Undeclared',
              semester: details.semester || 'Unknown',
              attendance: studentAttendance,
              assignments,
              avatar: details.avatar || `https://i.pravatar.cc/150?u=${student.studentID}`,
            };
          });

          setParticipants(formattedParticipants);
          setLectures(attendanceData.map(lecture => ({
            ...lecture,
            attendanceList: lecture.attendanceList || []
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingParticipants(false);
      }
    };

    fetchAttendanceAndParticipants();
  }, [activeTab, courseID]);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const handleAssignmentUpload = async (assignmentName, assignmentFile, assignmentDueDate) => {
    if (!assignmentName || !assignmentFile || !assignmentDueDate) {
      alert('Please provide an assignment name, select a file, and specify a due date.');
      return;
    }

    const formData = new FormData();
    formData.append('assignmentName', assignmentName);
    formData.append('courseName', courseID);
    formData.append('studentID', studentID);
    formData.append('assignment', assignmentFile);
    formData.append('dueDate', assignmentDueDate);

    try {
      const response = await fetch(`${config.API}/uploadAssignment/uploadAssignment`, {
        method: 'POST',
        body: formData,
      });

      const resultText = await response.text();
      if (response.ok && resultText.includes('Successfully uploaded assignment')) {
        setAssignments(prevAssignments => [
          ...prevAssignments,
          { assignmentName, filePath: 'Unknown', dueDate: assignmentDueDate }
        ]);
        alert(resultText);
        window.location.reload();
      } else {
        alert(`Failed to upload assignment. Server responded with: ${resultText}`);
      }
    } catch (error) {
      console.error('Error uploading assignment:', error);
      alert('An error occurred while uploading the assignment.');
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`${config.API}/getAttendance/getAttendance?courseName=${courseID}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.success ? data.lectures : [];
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      return [];
    }
  };

  const fetchGradesForStudent = async (courseID, studentID) => {
    try {
      const response = await fetch(`${config.API}/getGrades/getGrade?courseID=${courseID}&studentID=${studentID}`);
      if (!response.ok) throw new Error('Failed to fetch grades');
      const data = await response.json();
      return data.grades || [];
    } catch (error) {
      console.error('Error fetching grades:', error);
      return [];
    }
  };

  const handleAttendanceChange = (lectureIndex, studentID, status) => {
    setLectures(prevLectures => {
      const updatedLectures = [...prevLectures];
      const lecture = updatedLectures[lectureIndex];
      const student = lecture.attendanceList.find(a => a.studentID === studentID);
      if (student) student.status = status;
      return updatedLectures;
    });
  };

  const handleSaveAttendance = async (lectureIndex) => {
    const lecture = lectures[lectureIndex];
    const attendanceData = {
      courseName: courseID,
      lectureDate: lecture.lectureDate,
      attendanceList: lecture.attendanceList.map(record => ({
        studentID: record.studentID,
        status: record.status
      }))
    };

    try {
      const response = await fetch(`${config.API}/recordAttendance/recordAttendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert(`Attendance for ${lecture.lectureDate} saved successfully!`);
      } else {
        alert(`Failed to save attendance: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('An error occurred while saving the attendance.');
    }
  };

  const openGradeModal = (selectedAssignment) => {
    setSelectedAssignmentName(selectedAssignment.assignmentName);
    setIsModalOpen(true);
  };

  const closeGradeModal = () => {
    setIsModalOpen(false);
    setSelectedAssignmentName('');
  };

  const handleAddLecture = () => {
    const newLecture = {
      lectureDate: new Date().toISOString().split('T')[0],
      attendanceList: participants.map(participant => ({
        studentID: participant.id,
        status: 'Present',
      }))
    };
    setLectures([...lectures, newLecture]);
  };

  return (
    <div className="course-details-page" style={{ width: '100%', height: '100%' }}>
      {loading && <FullScreenLoader />}
      {!loading && courseDetails && (
        <>
          <CourseDetailsHeader
            courseDetails={courseDetails}
            coverImageName={coverImageName}
            onEditClick={handleEditClick}
          />
          <Container style={{ width: '100%', padding: '0' }}>
            <BreadcrumbsNav />
            <TabsNavigation activeTab={activeTab} handleTabChange={handleTabChange} />
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
                <AssignmentsSection
                  assignments={assignments}
                  onDownload={handleDownload}
                  onUpload={handleAssignmentUpload}
                  onEdit={openGradeModal} // Pass the function to open the grade modal
                />
              </>
            )}
            {activeTab === 1 && (
              <ParticipantsSection participants={participants} />
            )}
            {activeTab === 2 && (
              <LecturesSection
                lectures={lectures}
                participants={participants}
                onAttendanceChange={handleAttendanceChange}
                onSaveAttendance={handleSaveAttendance}
                onAddLecture={handleAddLecture}
              />
            )}
          </Container>
        </>
      )}
      {isModalOpen && (
        <GradeAssignmentModal
          open={isModalOpen}
          onClose={closeGradeModal}
          assignmentName={selectedAssignmentName}
          courseID={courseID}
        />
      )}
    </div>
  );
};

export default CourseInstructorCourseDetails;
