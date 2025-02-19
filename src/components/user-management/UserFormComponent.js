import { UserContext } from "@/stores/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Divider,
  Input,
  Option,
  Select,
  Typography,
  CircularProgress,
} from "@mui/joy";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TextFieldComponent from "../forms/TextFieldComponent";
import SelectFieldComponent from "../forms/SelectFieldComponent";

function UserFormComponent({
  mode = 1,
  handleCloseAddModal,
  handleCloseEditModal,
  DataState,
  user,
}) {
  const { storeUser, setUserState, showSnackbar, updateUser } =
    useContext(UserContext);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let response;
      if (mode === 1) {
        console.log(data);
        response = await storeUser(data);

        if (response.status === 201) {
          showSnackbar("User added successfully!", "success");
        } else {
          showSnackbar("User addition failed!", "danger");
        }
      } else {
        response = await updateUser(user?.slug, data);

        if (response.status === 201) {
          showSnackbar("User updated successfully!", "success");
        } else {
          showSnackbar("User update failed!", "danger");
        }
      }

      if (response && response.data) {
        setUserState((prevState) => ({
          ...prevState,
          responseStore: true,
        }));
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      // Check if the error response is a validation error (status code 422)
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        let errorMessages = Object.values(validationErrors).flat().join("\n");
        if (mode === 1) {
          showSnackbar(errorMessages, "danger");
        } else {
          showSnackbar(errorMessages, "danger");
        }
      } else {
        // Handle other errors (e.g., network issues, server errors)
        if (mode === 1) {
          showSnackbar(error.message, "danger");
        } else {
          showSnackbar(error.message, "danger");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formSchema = z.object({
    f_name: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    m_name: z.string().nullable(),
    l_name: z.string().nullable(),
    suffix: z.string().nullable(),
    contact_number: z.string().min(11, {
      message: "Contact number must be at least 11 numbers.",
    }),
    email: z.string().email({
      message: "Email must be a valid email address.",
    }),
    password:
      mode === 1
        ? z
            .string()
            .min(8, { message: "Password must be at least 8 characters." })
        : z.string().nullable(),
    company_id: z.number().default(0),
    department_id: z.number().default(0),
    supplier_id: z.number().default(0),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      f_name: user?.f_name || "",
      m_name: user?.m_name || "",
      l_name: user?.l_name || "",
      suffix: user?.suffix || "",
      contact_number: user?.contact_number || "",
      email: user?.email || "",
      password: "",
      company_id: user?.company_id || 0,
      department_id: user?.department_id || 0,
      supplier_id: user?.supplier_id || 0,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 2 }}>
        <Box sx={{ mb: 2, mt: 2 }}>
          <TextFieldComponent
            form={form}
            name="f_name"
            type="text"
            label="First Name"
            variant="filled"
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextFieldComponent
            form={form}
            name="m_name"
            type="text"
            label="Middle Name"
            variant="filled"
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextFieldComponent
            form={form}
            name="l_name"
            type="text"
            label="Last Name"
            variant="filled"
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextFieldComponent
            form={form}
            name="suffix"
            type="text"
            label="Suffix"
            variant="filled"
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextFieldComponent
            form={form}
            name="contact_number"
            type="text"
            label="Contact Number"
            variant="filled"
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <SelectFieldComponent
            form={form}
            name="creation_type"
            label="Creation Type"
            DataState={[
              { id: 1, name: "Admin" },
              { id: 2, name: "Supplier" },
            ]}
            defaultValue="0"
          />
        </Box>
        {form.getValues("creation_type") === 1 ? (
          <>
            <Box sx={{ mb: 2 }}>
              <SelectFieldComponent
                form={form}
                name="company_id"
                label="Company"
                DataState={DataState.company_data}
                defaultValue="0"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <SelectFieldComponent
                form={form}
                name="department_id"
                label="Department"
                DataState={DataState.department_data}
                defaultValue="0"
              />
            </Box>
          </>
        ) : form.getValues("creation_type") === 2 ? (
          <React.Fragment>
            <Box sx={{ mb: 2 }}>
              <SelectFieldComponent
                form={form}
                name="supplier_id"
                label="Supplier"
                DataState={DataState.supplier_data.suppliers}
                defaultValue="0"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <SelectFieldComponent
                form={form}
                name="department_id"
                label="Department"
                DataState={DataState.department_data}
                defaultValue="0"
              />
            </Box>
          </React.Fragment>
        ) : null}
        <Box sx={{ mb: 2 }}>
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
          >
            Account Credentials
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 2 }}>
          <TextFieldComponent
            form={form}
            name="email"
            type="text"
            label="Email"
            variant="filled"
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextFieldComponent
            form={form}
            name="password"
            type="password"
            label={
              mode === 1 ? "Password" : "Password (Leave blank to keep current)"
            }
            variant="filled"
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "flex-end",
          mt: 2,
        }}
      >
        <Button
          variant="plain"
          color="neutral"
          onClick={mode === 1 ? handleCloseAddModal : handleCloseEditModal}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="solid"
          color="primary"
          type="submit"
          disabled={isSubmitting}
          startDecorator={isSubmitting ? <CircularProgress size="sm" /> : null}
        >
          {isSubmitting
            ? "Submitting..."
            : mode === 1
              ? "Add User"
              : "Update User"}
        </Button>
      </Box>
    </form>
  );
}

export default UserFormComponent;
