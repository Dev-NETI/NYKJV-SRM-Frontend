"use client";
import React, { useState } from "react";
import Header from "../Header";
import DocumentListComponent from "@/components/supplier-document/DocumentListComponent";
import DocumentListNavigationComponent from "@/components/supplier-document/DocumentListNavigationComponent";
import DialogComponent from "@/components/material-ui/DialogComponent";
import DocumentFormComponent from "@/components/supplier-document/DocumentFormComponent";
import { Snackbar } from "@mui/material";
import { SupplierDocumentContext } from "@/stores/SupplierDocumentContext";

function page() {
  const [supplierDocumentState, setSupplierDocumentState] = useState({
    modal: false,
    snackbar: false,
    snackbarMessage: "",
    snackbarVertical: "top",
    snackbarHorizontal: "right",
    reload: true,
  });

  const handleClickOpen = () => {
    setSupplierDocumentState((prevState) => ({ ...prevState, modal: true }));
  };

  const handleClose = () => {
    setSupplierDocumentState((prevState) => ({ ...prevState, modal: false }));
  };

  return (
    <SupplierDocumentContext.Provider
      value={{ supplierDocumentState, setSupplierDocumentState }}
    >
      <div className="p-4">
        <Header title="Documents" />
        <div className="flex flex-col md:flex-row lg:flex-row gap-4 mt-4">
          <DocumentListNavigationComponent
            handleOpenFileUploadModal={handleClickOpen}
          />
          <DocumentListComponent />
        </div>

        <DialogComponent
          open={supplierDocumentState.modal}
          handleClose={handleClose}
          title="New file upload"
        >
          <DocumentFormComponent setSnackbarMethod={setSupplierDocumentState} />
        </DialogComponent>

        <Snackbar
          anchorOrigin={{
            vertical: supplierDocumentState.snackbarVertical,
            horizontal: supplierDocumentState.snackbarHorizontal,
          }}
          open={supplierDocumentState.snackbar}
          onClose={() =>
            setSupplierDocumentState((prevState) => ({
              ...prevState,
              snackbar: false,
            }))
          }
          message={supplierDocumentState.snackbarMessage}
          key={
            supplierDocumentState.snackbarVertical +
            supplierDocumentState.snackbarHorizontal
          }
        />
      </div>
    </SupplierDocumentContext.Provider>
  );
}

export default page;
