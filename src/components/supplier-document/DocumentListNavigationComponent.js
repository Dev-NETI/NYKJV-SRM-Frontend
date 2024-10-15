import React from "react";
// import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import FileUploadIcon from "@mui/icons-material/FileUpload";

function DocumentListNavigationComponent({ handleOpenFileUploadModal }) {
  return (
    <div className="basis-full md:basis-2/12 lg:basis-2/12">
      <Paper>
        <MenuList>
          <MenuItem onClick={handleOpenFileUploadModal}>
            <ListItemIcon>
              <FileUploadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>New file upload</ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>
    </div>
  );
}

export default DocumentListNavigationComponent;
