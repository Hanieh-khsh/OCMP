import React from 'react';
import '../css/SuccessModal.css';

/* 
Component for displaying a success message in a modal.
Includes a welcome message and user credentials, and provides a button to close the modal.
*/
const SuccessModal = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose} className="close-sign">&times;</button>
        <h2>Hi Beatrice! Welcome to University of Regina!</h2>
        <p>Your User Name is : 200511066</p>
        <p>Password: T2r0i0x5!</p>
        <button onClick={onClose} className="close-button">Send to My Phone</button>
      </div>
    </div>
  );
};

export default SuccessModal;
