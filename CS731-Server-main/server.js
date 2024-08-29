require('dotenv').config({ path: './Config.env' });
const express = require('express');
const cors = require('cors');
const { connectToMongoDB } = require('./connection');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '1000mb' }));
app.use(express.static(__dirname + '/'));
app.use(cors());

const port = 8081;

// Import routes
const addUser = require('./routes/addUser');
const loginUser = require('./routes/loginUser');
const getCourseListInstructor = require('./routes/getCourseListInstructor');
const getCourseDescription = require('./routes/getCourseDescription');
const createCourse = require('./routes/createCourse');
const getUser = require('./routes/getUser');
const getAllStudents = require('./routes/getAllStudents');
const registerUser = require('./routes/registerUser');
const getCourseListStudent = require('./routes/getCourseListStudent');
const getCourseContent = require('./routes/getCourseContent');
const uploadCourseMaterial = require('./routes/uploadCourseMaterial');
const editCourse = require('./routes/editCourse');
const deleteCourseMaterial = require('./routes/deleteCourseMaterial');
const getRegisteredStudents = require('./routes/getRegisteredStudents');
const getAssignments = require('./routes/getAssignment');
const uploadAssignment = require('./routes/uploadAssignment');
const recordAttendance = require('./routes/recordAttendance');
const getAttendance = require('./routes/getAttendance');
const userChat = require('./routes/userChat');
const gradeAssignment = require('./routes/gradeAssignment');
const getGrades = require('./routes/getGrades');

// Initialize the database connection
connectToMongoDB().then(() => {
    // Use routes
    app.use('/addUser', addUser);
    app.use('/loginUser', loginUser);
    app.use('/getCourseListInstructor', getCourseListInstructor);
    app.use('/getCourseDescription', getCourseDescription);
    app.use('/createCourse', createCourse);
    app.use('/getUser', getUser);
    app.use('/getAllStudents', getAllStudents);
    app.use('/registerStudents', registerUser);
    app.use('/getCourseListStudent', getCourseListStudent);
    app.use('/getCourseContent', getCourseContent);
    app.use('/uploadCourseMaterial', uploadCourseMaterial);
    app.use('/editCourse', editCourse);
    app.use('/deleteCourseMaterial', deleteCourseMaterial);
    app.use('/getRegisteredStudents', getRegisteredStudents);
    app.use('/getAssignments', getAssignments);
    app.use('/uploadAssignment', uploadAssignment);
    app.use('/recordAttendance', recordAttendance);
    app.use('/getAttendance', getAttendance);
    app.use('/userChat', userChat);
    app.use('/gradeAssignment', gradeAssignment);
    app.use('/getGrades', getGrades);

    // Start the server
    app.listen(port, () => console.log(`App running on port ${port}!`));
}).catch(err => {
    console.error("Failed to connect to MongoDB", err);
});
