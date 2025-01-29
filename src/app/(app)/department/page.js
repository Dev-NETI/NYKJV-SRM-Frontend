"use client";
import React, { useState } from "react";
import Header from "../Header";
import DepartmentList from "@/components/department/DepartmentList";
import Button from "@mui/material/Button";
import DepartmentForm from "@/components/department/DepartmentForm";
import { ToastContainer } from "react-toastify";

function page() {
  const [parentState, setParentState] = useState({
    formDialog: false,
  });
  const [reloadList, setReloadList] = useState();

  const handleFormDialog = () => {
    setParentState((prevState) => ({
      ...prevState,
      formDialog: !parentState.formDialog,
    }));
  };

  return (
    <div className="flex flex-col gap-4 mx-5">
      <Header title="Department Management" />

      <div className="px-32 mt-14 flex justify-end">
        <Button variant="outlined" onClick={handleFormDialog}>
          Create
        </Button>
      </div>

      <div className="px-32 ">
        <DepartmentList reloadList={reloadList} setReloadList={setReloadList} />
      </div>

      <DepartmentForm
        formDialog={parentState.formDialog}
        handleFormDialog={handleFormDialog}
        setReloadList={setReloadList}
      />
      <ToastContainer />
    </div>
  );
}

export default page;
