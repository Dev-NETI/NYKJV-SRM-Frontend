import React from "react";
import { MenuItem } from "@mui/material";
import Link from "next/link";

function ContextMenuItemComponent({ filePath = null, icon, label, ...props }) {
  return (
    <MenuItem {...props}>
      {filePath ? (
        <>
          <Link href={filePath} target="_blank">
            <div className="flex flex-row gap-2 justify-between">
              {icon}
              {label}
            </div>
          </Link>
        </>
      ) : (
        <div className="flex flex-row gap-2 justify-between">
          {icon}
          {label}
        </div>
      )}
    </MenuItem>
  );
}

export default ContextMenuItemComponent;
