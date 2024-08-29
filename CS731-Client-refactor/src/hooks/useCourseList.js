// useCourseList.js
import config from '../config';


export const fetchAttendanceData = async (courseName, studentID) => {
    try {
      const response = await fetch(`${config.API}/getAttendance/getAttendance?courseName=${courseName}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const studentAttendance = data.lectures.flatMap(lecture =>
            lecture.attendanceList.filter(att => att.studentID === studentID)
          );
  
          const attendanceSummary = studentAttendance.reduce((summary, record) => {
            summary[record.status] = (summary[record.status] || 0) + 1;
            return summary;
          }, {});
  
          return attendanceSummary;
        }
      } else {
        console.error('Failed to fetch attendance data');
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
    return {};
  };
  
  export const fetchInstructorName = async (instructorID) => {
    try {
      const response = await fetch(`${config.API}/getUser/getUser/${instructorID}`);
      if (response.ok) {
        const userData = await response.json();
        return `${userData.firstName} ${userData.lastName}`;
      } else {
        console.error('Failed to fetch instructor data');
        return 'N/A';
      }
    } catch (error) {
      console.error('Error fetching instructor data:', error);
      return 'N/A';
    }
  };
  
  export const fetchGradesForCourse = async (courseName, studentID) => {
    try {
      const response = await fetch(`${config.API}/getGrades/getGrade?courseID=${courseName}&studentID=${studentID}`);
      if (response.ok) {
        const data = await response.json();
        return data.grades || [];
      } else {
        console.error('Failed to fetch grades');
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
    return [];
  };
  
  export const fetchStudentCourses = async (studentID, setLoading, setCourses, fetchAttendanceData, fetchInstructorName, fetchGradesForCourse) => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API}/getCourseListStudent/getCourseListStudent/${studentID}`);
      if (response.ok) {
        const data = await response.json();
        const courseList = data.courses || [];
        const updatedCourses = await Promise.all(courseList.map(async (course) => {
          const attendanceData = await fetchAttendanceData(course.courseName, studentID);
          const instructorName = await fetchInstructorName(course.studentID); // Assuming each course has an instructorID
          const grades = await fetchGradesForCourse(course.courseName, studentID);
          return { ...course, attendance: attendanceData, instructor: instructorName, grades };
        }));
        setCourses(updatedCourses);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Other utility functions
  export const getGradientColor = (percentage) => {
    const r = Math.min(255, Math.round((255 * (100 - percentage)) / 100));
    const g = Math.min(255, Math.round((255 * percentage) / 100));
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  };
  
  export const updateCurrentSemester = (setCurrentSemester) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
  
    let semester;
    if (currentMonth < 4) {
      semester = `Winter Semester ${currentYear}`;
    } else if (currentMonth < 8) {
      semester = `Spring/Summer Semester ${currentYear}`;
    } else {
      semester = `Fall Semester ${currentYear}`;
    }
    setCurrentSemester(semester);
  };
  
  export const fetchUserData = async (studentID) => {
    try {
      const response = await fetch(`${config.API}/getUser/getUser/${studentID}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Failed to fetch user data');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };