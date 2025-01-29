"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useCompanies } from "@/hooks/api/companies";
import Select from "@mui/material/Select";
import { useDepartment } from "@/hooks/api/department";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DepartmentForm({
  formDialog,
  handleFormDialog,
  setReloadList,
}) {
  const { index: getCompany } = useCompanies();
  const [formState, setFormState] = useState({
    companyData: [],
  });
  const { store } = useDepartment();
  const formik = useFormik({
    initialValues: {
      departmentName: "",
      companyId: "",
    },
    validationSchema: Yup.object({
      departmentName: Yup.string().required("Department is required"),
      companyId: Yup.string().required("Company is required"),
    }),
    onSubmit: async (values) => {
      const { data: storeResponse } = await store(values);

      storeResponse.response
        ? (toast.success(storeResponse.message), setReloadList(Math.random()))
        : toast.error(storeResponse.message);

      handleFormDialog();
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: companyData } = await getCompany();
      setFormState((prevState) => ({ ...prevState, companyData: companyData }));
    };
    fetchData();
  }, []);

  return (
    <>
      <Dialog
        open={formDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleFormDialog}
      >
        <DialogTitle>Create Deparment</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-2">
            <TextField
              label="Department"
              variant="outlined"
              name="departmentName"
              value={formik.values.departmentName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.departmentName &&
                Boolean(formik.errors.departmentName)
              }
              helperText={
                formik.touched.departmentName && formik.errors.departmentName
              }
            />

            <>
              <InputLabel>Company</InputLabel>
              <Select
                name="companyId"
                value={formik.values.companyId}
                label="Company"
                onChange={(event) =>
                  formik.setFieldValue("companyId", event.target.value)
                }
                onBlur={formik.handleBlur}
              >
                {formState.companyData.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={formik.handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
