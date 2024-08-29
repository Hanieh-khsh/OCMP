import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Checkbox, FormControlLabel, Container, Typography, Link, Box } from '@mui/material';
import './LoginForm.css';

const LoginForm = ({ userType }) => {
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!studentID || !password) {
      alert('Please enter both Student ID and Password');
      return;
    }

    try {
      const response = await fetch('http://204.83.75.184:8080/loginUser/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentID, password })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Login successful');
        navigate('/courses');
      } else {
        const message = await response.text();
        alert(`Login failed: ${message}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again later.');
    }
  };

  return (
    <Container mt={1} maxWidth="xs">
      <Box mt={0} pd={1}>
        <TextField
          fullWidth
          margin="normal"
          label={userType === 'student' ? 'Student ID' : 'Instructor ID'}
          value={studentID}
          onChange={(e) => setStudentID(e.target.value)}
          variant="outlined"
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          required
        />
        <Box textAlign="left">
          <FormControlLabel
            control={<Checkbox name="saveInfo" color="primary" />}
            label="Save my information"
          />
        </Box>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ mt: 2, mb: 2, bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}
        >
          LOG IN
        </Button>
        {/* {userType === 'student' && (
          <Link href="#" variant="body2">
            <Box textAlign="right">
              Future Feature1
            </Box>
          </Link>
        )} */}
      </Box>
    </Container>
  );
};

export default LoginForm;
