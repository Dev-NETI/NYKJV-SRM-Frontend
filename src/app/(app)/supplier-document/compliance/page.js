"use client";
import Header from "../../Header";
import React, { useState } from "react";
import ComplianceDocumentListComponent from "@/components/supplier-document/compliance/ComplianceDocumentListComponent";
import DocumentListNavigationComponent from "@/components/supplier-document/DocumentListNavigationComponent";
import DialogComponent from "@/components/material-ui/DialogComponent";
import DocumentFormComponent from "@/components/supplier-document/DocumentFormComponent";
import { Snackbar } from "@mui/material";
import { SupplierDocumentContext } from "@/stores/SupplierDocumentContext";
import Alert from "@mui/material/Alert";
import { useAuth } from "@/hooks/auth";

function Page() {
  const [supplierDocumentState, setSupplierDocumentState] = useState({
    modal: false,
    snackbar: false,
    snackbarMessage: "",
    snackbarVertical: "top",
    snackbarHorizontal: "right",
    snackBarSeverity: "success",
    reload: true,
    activePage: 1, //1 - documents, 0 - trash
    supplierId: 0,
  });
  const { user } = useAuth({ middlware: "auth" });
  const [initialDocumentTypeInForm, setInitialDocumentTypeInForm] =
    useState(null);

  const handleClickOpen = (id = 0) => {
    setSupplierDocumentState((prevState) => ({ ...prevState, modal: true }));
    setInitialDocumentTypeInForm(id);
  };

  const handleClose = () => {
    setSupplierDocumentState((prevState) => ({ ...prevState, modal: false }));
  };

  return (
    <SupplierDocumentContext.Provider
      value={{
        supplierDocumentState,
        setSupplierDocumentState,
        initialDocumentTypeInForm,
        setInitialDocumentTypeInForm,
      }}
    >
      <div className="p-4">
        <Header title="Documents" />
        <div className="flex flex-col md:flex-row lg:flex-row gap-4 mt-4">
          {user?.supplier_id ? (
            <DocumentListNavigationComponent
              handleOpenFileUploadModal={handleClickOpen}
            />
          ) : (
            <></>
          )}
          <ComplianceDocumentListComponent
            handleOpenFileUploadModal={handleClickOpen}
          />
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
          key={
            supplierDocumentState.snackbarVertical +
            supplierDocumentState.snackbarHorizontal
          }
        >
          <Alert
            onClose={() =>
              setSupplierDocumentState((prevState) => ({
                ...prevState,
                snackbar: false,
              }))
            }
            severity={supplierDocumentState.snackBarSeverity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {supplierDocumentState.snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </SupplierDocumentContext.Provider>
  );
}

export default Page;
