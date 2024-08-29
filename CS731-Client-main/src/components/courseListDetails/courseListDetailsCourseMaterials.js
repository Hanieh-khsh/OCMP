import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Link, IconButton, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ExpandMore, GetApp } from '@mui/icons-material';

const CourseMaterials = ({ sessionMaterials, handleDownload }) => (
  <Accordion sx={{ width: '100%' }}>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Typography gutterBottom variant="h6" component="div">
        What are Course materials?
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      {sessionMaterials && sessionMaterials.length > 0 ? (
        <List>
          {sessionMaterials.map((material, index) => {
            const fileNameWithPrefix = material.substring(material.lastIndexOf('/') + 1);
            const fileName = fileNameWithPrefix.replace(/^[\d]+_/g, '');

            return (
              <ListItem key={index}>
                <ListItemText>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDownload(material, fileName);
                    }}
                    style={{ textDecoration: 'none', color: '#000000' }}
                  >
                    {fileName}
                  </Link>
                </ListItemText>
                <ListItemIcon>
                  <IconButton
                    onClick={() => handleDownload(material, fileName)}
                    sx={{ color: '#537756' }}
                  >
                    <GetApp />
                  </IconButton>
                </ListItemIcon>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography variant="body2">No course materials available for download.</Typography>
      )}
    </AccordionDetails>
  </Accordion>
);

export default CourseMaterials;
