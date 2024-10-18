import React from "react";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FolderIcon from "@mui/icons-material/Folder";
import { useContext } from "react";
import { SupplierDocumentContext } from "@/stores/SupplierDocumentContext";

function DocumentListNavigationComponent({ handleOpenFileUploadModal }) {
  const { supplierDocumentState, setSupplierDocumentState } = useContext(
    SupplierDocumentContext
  );

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
          <Divider />
          <MenuItem
            selected={supplierDocumentState.activePage === 1}
            onClick={() =>
              setSupplierDocumentState((prevState) => ({
                ...prevState,
                activePage: 1,
                reload: true,
              }))
            }
          >
            <ListItemIcon>
              <FolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Documents</ListItemText>
          </MenuItem>
          <MenuItem
            selected={supplierDocumentState.activePage === 0}
            onClick={() =>
              setSupplierDocumentState((prevState) => ({
                ...prevState,
                activePage: 0,
                reload: true,
              }))
            }
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Trash</ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>
    </div>
  );
}

export default DocumentListNavigationComponent;
