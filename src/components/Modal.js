import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios'; // Import axios for the delete request

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ open, onClose, onConfirm, title, description }) {
    const [error, setError] = React.useState("");
  
    const handleDelete = async () => {
      try {
        await onConfirm();  // Calls the deletion function from the parent component
        onClose();  // Close the modal on success
      } catch (err) {
        console.error("Error deleting supplier:", err.response ? err.response.data : err.message);
        setError("Failed to delete the supplier. Please try again.");
      }
    };
  
    return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {description}
          </Typography>
          <div className="flex justify-end mt-4">
            <Button onClick={handleDelete} color="error">Yes</Button>
            <Button onClick={onClose}>No</Button>
          </div>
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Modal>
    );
  }
  