import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const CourseDescription = ({ description }) => (
  <Accordion sx={{ width: '100%' }}>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Typography gutterBottom variant="h6" component="div">
        What will you learn?
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography variant="body2" color="text.secondary">
        {description || 'No description provided.'}
      </Typography>
    </AccordionDetails>
  </Accordion>
);

export default CourseDescription;
