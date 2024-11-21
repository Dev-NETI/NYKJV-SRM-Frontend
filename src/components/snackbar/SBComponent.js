import {
  BlockOutlined,
  InfoOutlined,
  PlaylistAddCheck,
} from "@mui/icons-material";
import { Button, Snackbar } from "@mui/joy";
import React, { useEffect, useState } from "react";

function SBComponent({ open, message, color }) {
  const [openSnackbarLocal, setOpenSnackbarLocal] = useState(false);

  useEffect(() => {
    if (open) {
      setOpenSnackbarLocal(open);
    }
  }, [open]);

  let icon = "";

  switch (color) {
    case "success":
      icon = <PlaylistAddCheck />;
      break;
    case "danger":
      icon = <BlockOutlined />;
      break;
    default:
      icon = <InfoOutlined />;
      break;
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      variant="soft"
      color={color}
      open={openSnackbarLocal}
      onClose={() => setOpenSnackbarLocal(false)}
      startDecorator={icon}
      endDecorator={
        <Button
          onClick={() => setOpenSnackbarLocal(false)}
          size="sm"
          variant="soft"
          color="color"
        >
          Dismiss
        </Button>
      }
    >
      <span
        dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, "<br />") }}
      />
    </Snackbar>
  );
}

export default SBComponent;
