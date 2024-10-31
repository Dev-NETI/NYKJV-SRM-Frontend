import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

function SnackBarComponent({ open, onClose, severity, message }) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SnackBarComponent;
