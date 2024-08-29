import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { EventAvailable } from '@mui/icons-material';
import PropTypes from 'prop-types';

const Header = ({ userData, currentSemester }) => {
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  return (
    <Box bgcolor="#FFFFFF" mt={3} mb={2} display="flex" alignItems="center" justifyContent="space-between" textAlign="left">
      <Box display="flex" alignItems="center" borderLeft={'5px solid #05440A'} paddingLeft={1} borderRadius={1}>
        <img src="/img/Fallsemester.jpg" alt="Fallsemester in University of Regina" className="logo" width={80} />
        <Box ml={2}>
          <Typography variant="h4">
            {getGreeting()}, {userData ? `${userData.firstName}` : 'Guest'}!
          </Typography>
          <Typography variant="subtitle1">{currentSemester}</Typography>
        </Box>
      </Box>
      <Box textAlign="right" padding={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EventAvailable />}
          sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, textTransform: 'none' }}
        >
          Future Feature
        </Button>
      </Box>
    </Box>
  );
};

Header.propTypes = {
  userData: PropTypes.object,
  currentSemester: PropTypes.string.isRequired,
};

export default Header;
