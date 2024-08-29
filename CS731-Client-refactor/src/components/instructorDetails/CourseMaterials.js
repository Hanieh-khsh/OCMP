import React from 'react';
import {
  Box, Accordion, AccordionSummary, AccordionDetails, Typography,
  List, ListItem, ListItemText, ListItemIcon, IconButton, Button
} from '@mui/material';
import { ExpandMore, GetApp, Add, Delete, CloudUpload } from '@mui/icons-material';

const CourseMaterials = ({ materials = [], newMaterials = [], onFileChange, onUpload, onDownload, onDelete }) => (
  <Box mb={2} textAlign="left" sx={{ width: '100%' }}>
    <Accordion sx={{ width: '100%' }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box>
          <IconButton aria-label="add" sx={{ color: 'inherit', '&:hover': { color: 'green' } }}>
            <Add />
          </IconButton>
        </Box>
        <Typography gutterBottom variant="h6" component="div">
          Course Materials
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {materials.length > 0 ? (
          <List>
            {materials.map((material, index) => {
              const fileNameWithPrefix = material.substring(material.lastIndexOf('/') + 1);
              const fileName = fileNameWithPrefix.replace(/^[\d]+_/g, '');

              return (
                <ListItem key={index}>
                  <ListItemText primary={fileName} />
                  <ListItemIcon>
                    <IconButton onClick={() => onDownload(material, index)} sx={{ color: '#537756' }}>
                      <GetApp />
                    </IconButton>
                    <IconButton onClick={() => onDelete(material, index)} sx={{ color: '#ff0000' }}>
                      <Delete />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography variant="body2">No course materials available for download.</Typography>
        )}
        <input
          type="file"
          name="courseMaterials"
          multiple
          onChange={onFileChange}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUpload />}
            sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, textTransform: 'none', mt: 2 }}
          >
            Select Course's Material
          </Button>
        </label>
        {newMaterials.length > 0 && (
          <Box mt={2}>
            <Typography variant="body2">Files to be uploaded:</Typography>
            <List>
              {newMaterials.map((file, index) => (
                <ListItem key={index}>
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="primary"
              onClick={onUpload}
              sx={{ bgcolor: '#537756', '&:hover': { bgcolor: '#05440A' }, mt: 2 }}
            >
              Upload Selected Files
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  </Box>
);

export default CourseMaterials;
