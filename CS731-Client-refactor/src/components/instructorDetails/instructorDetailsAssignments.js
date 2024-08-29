import React, { useState } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, List, ListItem, ListItemText, TextField, Input, Button, Grid } from '@mui/material';
import { ExpandMore, GetApp, CloudUpload, Edit } from '@mui/icons-material';

const AssignmentsSection = ({ assignments, onDownload, onUpload, onEdit }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [newAssignmentName, setNewAssignmentName] = useState('');
  const [newAssignmentFile, setNewAssignmentFile] = useState(null);
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('');

  const handleAssignmentNameChange = (e) => setNewAssignmentName(e.target.value);
  const handleAssignmentFileChange = (e) => setNewAssignmentFile(e.target.files[0]);
  const handleAssignmentDueDateChange = (e) => setNewAssignmentDueDate(e.target.value);

  const handleUpload = () => {
    onUpload(newAssignmentName, newAssignmentFile, newAssignmentDueDate);
    setNewAssignmentName('');
    setNewAssignmentFile(null);
    setNewAssignmentDueDate('');
    setIsUploading(false);
  };

  return (
    <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
      <Accordion sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography gutterBottom variant="h6" component="div">
            Assignments
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {isUploading ? (
            <Box display="flex" flexDirection="column" spacing={2}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={10}>
                  <TextField
                    fullWidth
                    label="Assignment Name"
                    value={newAssignmentName}
                    onChange={handleAssignmentNameChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <label htmlFor="upload-assignment-file">
                    <Input
                      id="upload-assignment-file"
                      type="file"
                      onChange={handleAssignmentFileChange}
                      sx={{ display: 'none' }}
                    />
                    <Box display="flex" alignItems="center">
                      <IconButton
                        color="primary"
                        aria-label="upload assignment"
                        component="span"
                        sx={{ color: '#537756', '&:hover': { color: '#05440A' } }}
                      >
                        <CloudUpload />
                      </IconButton>
                      {newAssignmentFile && (
                        <Typography variant="body2" sx={{ ml: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {newAssignmentFile.name}
                        </Typography>
                      )}
                    </Box>
                  </label>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    value={newAssignmentDueDate}
                    onChange={handleAssignmentDueDateChange}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                sx={{ textTransform: 'none', bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}
              >
                Upload Assignment
              </Button>
              <Button
                onClick={() => setIsUploading(false)}
                sx={{ mr: 2, textTransform: 'none', color: '#f50057' }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <>
              <List>
                {assignments.length > 0 ? (
                  assignments.map((assignment, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={assignment.assignmentName} />
                      <IconButton
                        color="primary"
                        onClick={() => onDownload(assignment.filePath)}
                        sx={{ color: '#537756', '&:hover': { color: '#05440A' } }}
                      >
                        <GetApp />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => onEdit(assignment)}
                        sx={{ color: '#537756', '&:hover': { color: '#05440A' }, ml: 2 }}
                      >
                        <Edit />
                      </IconButton>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No assignments uploaded.
                  </Typography>
                )}
              </List>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsUploading(true)}
                sx={{ mt: 2, textTransform: 'none', bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' } }}
              >
                Upload Assignment
              </Button>
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AssignmentsSection;
