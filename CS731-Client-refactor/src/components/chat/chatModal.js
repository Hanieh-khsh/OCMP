import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText, Avatar, Button } from '@mui/material';
import ChatWindow from './chatWindow';
import config from '../../config';  // Import the config


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

const ChatModal = ({ open, handleClose }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${config.API}/getAllStudents/getAllStudents`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error retrieving students:", error);
      }
    };

    if (open) {
      fetchStudents();
    }
  }, [open]);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          Chat with Students
        </Typography>
        {!selectedStudent ? (
          <List>
            {students.map((student) => (
              <ListItem button key={student._id} onClick={() => handleStudentClick(student)}>
                <Avatar src={student.avatar || 'https://i.pravatar.cc/150'} alt={student.firstName} sx={{ marginRight: 2 }} />
                <ListItemText primary={`${student.firstName} ${student.lastName}`} />
              </ListItem>
            ))}
          </List>
        ) : (
          <ChatWindow student={selectedStudent} handleBack={() => setSelectedStudent(null)} />
        )}
      </Box>
    </Modal>
  );
};

export default ChatModal;
