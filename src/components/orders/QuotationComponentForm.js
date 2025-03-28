import React, { useState, useRef, useEffect } from "react";
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
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from "mui-tiptap";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/auth";
import SnackBarComponent from "../material-ui/SnackBarComponent";
import { ToastContainer, toast } from "react-toastify";

export default function EmailFileUploadForm() {
  const [file, setFile] = useState(null);
  const { user } = useAuth({ middleware: "auth" });
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const rteRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const validationSchema = Yup.object().shape({
    emails: Yup.array()
      .of(Yup.string().email("Invalid email"))
      .min(1, "At least one email is required"),
    emailBody: Yup.string()
      .required("Message is required!")
      .test(
        "minLength",
        "Message must be at least 10 characters long",
        (value) => {
          const editorContent = rteRef.current?.editor?.getHTML();
          return (
            editorContent &&
            editorContent.replace(/<\/?[^>]+(>|$)/g, "").trim().length >= 10
          );
        }
      ),
    fileQuotation: Yup.mixed()
      .required("File is required")
      .test(
        "fileFormat",
        "Only PDF files are allowed",
        (value) => value && value.type === "application/pdf"
      ),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    values.company = user?.supplier?.name;
    values.supplierId = user?.supplier_id;
    values.orderDocumentTypeId = 1;
    values.fileName = values.fileQuotation.name;
    values.emailBody = rteRef.current?.editor?.getHTML();

    const { data: response } = await axios.post(
      "/api/order/send-quotation",
      values,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setSubmitting(true);
    setSnackbarState({
      open: true,
      message: response.message,
      severity: response.severity,
    });

    rteRef.current.value = "";
    resetForm();
    setFile(null);
    setSubmitting(false);
  };

  return (
    <>
      <Formik
        initialValues={{
          emails: [],
          emailBody: "",
          emailInput: "",
          fileQuotation: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting, errors }) => (
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
                disabled={!user?.supplier_id}
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
                <Typography variant="subtitle1" gutterBottom>
                  Message
                </Typography>
                {isClient && (
                  <RichTextEditor
                    ref={rteRef}
                    extensions={[StarterKit]}
                    content="<p>Dear Sir/Ma'am,</p><p>Your message here.</p>"
                    immediatelyRender={false}
                    onUpdate={({ editor }) =>
                      setFieldValue("emailBody", editor.getHTML())
                    }
                    renderControls={() => (
                      <MenuControlsContainer>
                        <MenuSelectHeading />
                        <MenuDivider />
                        <MenuButtonBold />
                        <MenuButtonItalic />
                      </MenuControlsContainer>
                    )}
                  />
                )}
                {errors.emailBody && (
                  <Typography color="error">{errors.emailBody}</Typography>
                )}
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  disabled={!user?.supplier_id}
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
                  disabled={!user?.supplier_id}
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

      <ToastContainer />
    </>
  );
}
