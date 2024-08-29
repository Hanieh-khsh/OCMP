import React from 'react';
import { List, ListItem, ListItemText, IconButton, Accordion, AccordionSummary, AccordionDetails, Typography, Link } from '@mui/material';
import { ExpandMore, CloudUpload } from '@mui/icons-material';

const AssignmentsSection = ({
  assignments,
  enrichedAssignments,
  handleDownload,
  handleFileChange,
  isPastDueDate,
  formatDate,
}) => (
  <Accordion sx={{ width: '100%' }}>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Typography gutterBottom variant="h6" component="div">
        Assignments
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      {enrichedAssignments.length > 0 ? (
        <List>
          {enrichedAssignments.map((assignment) => (
            <ListItem key={assignment._id}>
              <ListItemText>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownload(assignment.filePath, assignment.filePath.split('/').pop());
                  }}
                  style={{ textDecoration: 'none', color: '#000000' }}
                >
                  {assignment.assignmentName} - Due:
                  <span style={{ color: isPastDueDate(assignment.dueDate) ? 'red' : 'inherit' }}>
                    {" " + formatDate(assignment.dueDate)}
                  </span>
                </Link>
                {assignment.localAssignment && (
                  <Typography variant="body2" color="textSecondary">
                    Submitted File: <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(assignment.localAssignment.filePath, assignment.localAssignment.filePath.split('/').pop());
                      }}
                      style={{ textDecoration: 'none', color: '#000000' }}
                    >
                      {assignment.localAssignment.filePath.split('/').pop().replace(/^\d+_/, '')}
                    </Link>
                    {' - ' + formatDate(assignment.localAssignment.uploadDate)}
                  </Typography>
                )}
              </ListItemText>
              <input
                type="file"
                onChange={(event) => handleFileChange(event, assignment._id)}
                style={{ display: 'none' }}
                id={`file-input-${assignment._id}`}
              />
              <IconButton
                color="primary"
                onClick={() => document.getElementById(`file-input-${assignment._id}`).click()}
                sx={{ color: '#537756', '&:hover': { color: '#05440A' } }}
              >
                <CloudUpload />
              </IconButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2">No assignments uploaded.</Typography>
      )}
    </AccordionDetails>
  </Accordion>
);

export default AssignmentsSection;
