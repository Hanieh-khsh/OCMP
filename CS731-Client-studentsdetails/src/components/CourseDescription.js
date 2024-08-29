import React from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const CourseDescription = ({ description }) => (
  <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
    <Accordion sx={{ width: '100%' }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography gutterBottom variant="h6" component="div">
          Course Description
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="text.secondary">
          {description || 'No description provided.'}
        </Typography>
      </AccordionDetails>
    </Accordion>
  </Box>
);

export default CourseDescription;
