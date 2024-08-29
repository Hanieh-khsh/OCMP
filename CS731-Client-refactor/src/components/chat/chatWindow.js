import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, List, ListItem, ListItemText, Avatar } from '@mui/material';
import config from '../../config';  // Import the config

const ChatWindow = ({ student, handleBack }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${config.API}/userChat/getMessages?userId1=currentUserId&userId2=${student._id}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error retrieving messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [student._id]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        const response = await fetch(`${config.API}/userChat/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderId: 'currentUserId', // Replace with the current user's ID
            receiverId: student._id,
            message,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Append the new message to the messages array
        setMessages([...messages, { message, senderId: 'currentUserId', timestamp: new Date().toISOString() }]);
        setMessage('');
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <Box>
      <Button onClick={handleBack} variant="outlined" sx={{ mb: 2 }}>
        &lt; Back
      </Button>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar src={student.avatar || 'https://i.pravatar.cc/150'} alt={student.firstName} sx={{ marginRight: 2 }} />
        <Typography variant="h6">
          Chat with {student.firstName} {student.lastName}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Messages</Typography>
        <Button onClick={fetchMessages} variant="contained" sx={{ ml: 2 }}>
          Refresh
        </Button>
      </Box>
      <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
        {messages.map((msg) => (
          <ListItem key={msg._id} sx={{ mb: 1 }}>
            <ListItemText
              primary={msg.message}
              secondary={msg.senderId === 'currentUserId' ? 'You' : student.firstName}
            />
          </ListItem>
        ))}
      </List>
      <Box display="flex" mt={2}>
        <TextField
          fullWidth
          label="Type a message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={handleSendMessage} color="primary" variant="contained" sx={{ ml: 2 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatWindow;
