import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BreadcrumbsNav = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default BreadcrumbsNav;
