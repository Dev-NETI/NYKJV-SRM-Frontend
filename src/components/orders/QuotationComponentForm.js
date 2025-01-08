import React, { useState } from "react";
import {
  TextField,
  Chip,
  Box,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useOrder } from "@/hooks/api/order";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/auth";
import SnackBarComponent from "../material-ui/SnackBarComponent";

export default function EmailFileUploadForm() {
  const { store: sendQuotation } = useOrder("send-quotation");
  const [file, setFile] = useState(null);
  const { user } = useAuth({ middleware: "auth" });
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validationSchema = Yup.object().shape({
    emails: Yup.array()
      .of(Yup.string().email("Invalid email"))
      .min(1, "At least one email is required"),
    fileQuotation: Yup.mixed()
      .required("File is required")
      .test(
        "fileFormat",
        "Only PDF files are allowed",
        (value) => value && value.type === "application/pdf"
      ),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      values.company = user?.company?.name;

      const { data: response } = await axios.post(
        "/api/order/send-quotation",
        values,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      response.response
        ? setSnackbarState({
            open: true,
            message: "Quotation sent successfully!",
            severity: "success",
          })
        : setSnackbarState({
            open: true,
            message: "Whoops! Something went wrong!",
            severity: "error",
          });

      resetForm();
      setFile(null);
    } catch (error) {
      setSnackbarState({
        open: true,
        message: "An error occurred while sending the quotation.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{ emails: [], emailInput: "", fileQuotation: null }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <Box sx={{ maxWidth: 500, margin: "auto", mt: 5 }}>
              <Typography variant="h5" gutterBottom>
                Send Quotation Form
              </Typography>

              <Field
                name="emailInput"
                as={TextField}
                label="Add Email"
                variant="outlined"
                fullWidth
                margin="normal"
                helperText="Press Enter or , to add email"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    if (
                      values.emailInput &&
                      !values.emails.includes(values.emailInput)
                    ) {
                      setFieldValue("emails", [
                        ...values.emails,
                        values.emailInput,
                      ]);
                      setFieldValue("emailInput", "");
                    }
                  }
                }}
              />
              <ErrorMessage
                name="emails"
                component="div"
                style={{ color: "red" }}
              />

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {values.emails.map((email, index) => (
                  <Chip
                    key={index}
                    label={email}
                    onDelete={() =>
                      setFieldValue(
                        "emails",
                        values.emails.filter((e) => e !== email)
                      )
                    }
                    color="primary"
                  />
                ))}
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    onChange={(event) => {
                      const file = event.target.files[0];
                      setFile(file);
                      setFieldValue("fileQuotation", file);
                    }}
                  />
                </Button>
                <ErrorMessage
                  name="fileQuotation"
                  component="div"
                  style={{ color: "red" }}
                />
              </Box>

              {file && (
                <Box
                  sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Typography variant="body2">
                    <strong>Selected File:</strong> {file.name}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      setFile(null);
                      setFieldValue("fileQuotation", null);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}

              <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
      <SnackBarComponent
        open={snackbarState.open}
        onClose={() =>
          setSnackbarState((prevState) => ({ ...prevState, open: false }))
        }
        severity={snackbarState.severity}
        message={snackbarState.message}
      />
    </>
  );
}
