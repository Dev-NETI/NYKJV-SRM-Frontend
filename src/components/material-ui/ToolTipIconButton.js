import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

function ToolTipIconButton({
  toolTipTitle,
  buttonSize = "small",
  children,
  ...props
}) {
  return (
    <Tooltip title={toolTipTitle}>
      <IconButton size={buttonSize} {...props}>
        {children}
      </IconButton>
    </Tooltip>
  );
}

export default ToolTipIconButton;
