import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BreadcrumbsNav = ({ breadcrumb }) => {
  const navigate = useNavigate();

  return (
    <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/courses" onClick={() => navigate('/courses')}>
          Student's Portal
        </Link>
        <Link underline="hover" color="inherit" href="/courses" onClick={() => navigate('/courses')}>
          Course List
        </Link>
        <Typography color="textPrimary">{breadcrumb}</Typography>
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbsNav;
