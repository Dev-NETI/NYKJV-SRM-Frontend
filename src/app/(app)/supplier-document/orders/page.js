"use client";
import React, { useState } from "react";
import DocumentListComponent from "@/components/supplier-document/DocumentListComponent";
import { Snackbar } from "@mui/material";
import { SupplierDocumentContext } from "@/stores/SupplierDocumentContext";
import Alert from "@mui/material/Alert";

function page() {
  const [supplierDocumentState, setSupplierDocumentState] = useState({
    snackbar: false,
    snackbarMessage: "",
    snackbarVertical: "top",
    snackbarHorizontal: "right",
    snackBarSeverity: "success",
    reload: true,
    activePage: 1, //1 - documents, 0 - trash
  });

  return (
    <SupplierDocumentContext.Provider
      value={{ supplierDocumentState, setSupplierDocumentState }}
    >
      <div className="flex flex-col md:flex-row lg:flex-row gap-4 mt-4 ">
        <DocumentListComponent />
      </div>

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
    </SupplierDocumentContext.Provider>
  );
}

export default page;
