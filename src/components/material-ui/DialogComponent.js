import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function DialogComponent({ open, handleClose, title, children }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          edge="end"
          sx={{
            position: "absolute",
            right: 20,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

export default DialogComponent;
