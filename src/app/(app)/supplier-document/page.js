"use client";
import React, { useState } from "react";
import Header from "../Header";
import DocumentListComponent from "@/components/supplier-document/DocumentListComponent";
import DocumentListNavigationComponent from "@/components/supplier-document/DocumentListNavigationComponent";
import DialogComponent from "@/components/material-ui/DialogComponent";
import DocumentFormComponent from "@/components/supplier-document/DocumentFormComponent";

function page() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="p-4">
      <Header title="Documents" />
      <div className="flex flex-col md:flex-row lg:flex-row gap-4 mt-4">
        <DocumentListNavigationComponent
          handleOpenFileUploadModal={handleClickOpen}
        />
        <DocumentListComponent />
      </div>

      <DialogComponent
        open={open}
        handleClose={handleClose}
        title="New file upload"
      >
        <DocumentFormComponent />
      </DialogComponent>
    </div>
  );
}

export default page;