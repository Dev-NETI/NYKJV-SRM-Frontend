import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ToolTipIconButton from "../material-ui/ToolTipIconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import RecyclingIcon from "@mui/icons-material/Recycling";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDepartment } from "@/hooks/api/department";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DepartmentListItem({ data, companyData, setReload }) {
  const [editMode, setEditMode] = useState(false);
  const { store: updateDepartment } = useDepartment("update-department");
  const { store: handleActivate } = useDepartment("handle-activation");

  const formik = useFormik({
    initialValues: {
      name: data.name || "",
      companyName: data.company?.name || "",
      companyId: data.company?.id,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Department name is required"),
      companyId: Yup.string().required("Company name is required"),
    }),
    onSubmit: async (values) => {
      values.departmentId = data.id;

      const { data: updateResponse } = await updateDepartment(values);

      updateResponse.response
        ? (toast.success(updateResponse.message), setReload(Math.random()))
        : toast.error(updateResponse.message);
      setEditMode(false);
    },
  });

  const handleActivation = async () => {
    const object = {
      departmentId: data.id,
      isActive: !data.is_active,
    };
    const { data: updateResponse } = await handleActivate(object);

    updateResponse.response
      ? (toast.success(updateResponse.message), setReload(Math.random()))
      : toast.error(updateResponse.message);
  };

  return (
    <TableRow
      hover
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        backgroundColor: !data.is_active && "#fab1a0",
      }}
    >
      <TableCell align="center">
        {editMode ? (
          <TextField
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            variant="outlined"
            size="small"
          />
        ) : (
          data.name
        )}
      </TableCell>
      <TableCell align="center">
        {editMode ? (
          <FormControl
            fullWidth
            error={formik.touched.companyId && Boolean(formik.errors.companyId)}
          >
            <InputLabel id="company-dropdown-label">Company</InputLabel>
            <Select
              labelId="company-dropdown-label"
              name="companyId"
              value={formik.values.companyId || ""}
              onChange={(event) =>
                formik.setFieldValue("companyId", event.target.value)
              }
              onBlur={formik.handleBlur}
              label="Company"
            >
              {companyData.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.companyId && formik.errors.companyId && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                {formik.errors.companyId}
              </p>
            )}
          </FormControl>
        ) : (
          data.company?.name
        )}
      </TableCell>
      <TableCell align="center">
        {editMode ? (
          <>
            <ToolTipIconButton
              toolTipTitle="Save"
              onClick={formik.handleSubmit}
            >
              <SaveAsIcon color="primary" />
            </ToolTipIconButton>
            <ToolTipIconButton
              toolTipTitle="Cancel"
              onClick={() => setEditMode(false)}
            >
              <CancelIcon color="error" />
            </ToolTipIconButton>
          </>
        ) : (
          <>
            <ToolTipIconButton
              toolTipTitle="Edit"
              onClick={() => setEditMode(true)}
            >
              <EditIcon color="success" />
            </ToolTipIconButton>

            <ToolTipIconButton
              toolTipTitle={data.is_active ? "Deactivate" : "Activate"}
              onClick={handleActivation}
            >
              {data.is_active ? (
                <DeleteIcon color="error" />
              ) : (
                <RecyclingIcon color="primary" />
              )}
            </ToolTipIconButton>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}

export default DepartmentListItem;
