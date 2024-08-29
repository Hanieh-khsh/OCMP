import React, { useState } from 'react';
import { Fab, Box } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatModal from './chatModal';

const ChatButton = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        style={{ position: 'fixed', bottom: 20, right: 20 }}
        onClick={handleClickOpen}
      >
        <ChatIcon />
      </Fab>
      <ChatModal open={open} handleClose={handleClose} />
    </>
  );
};

export default ChatButton;
