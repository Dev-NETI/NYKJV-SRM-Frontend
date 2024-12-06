import React, { useEffect, useState } from "react";
import SelectComponent from "../material-ui/SelectComponent";
import FileUploadComponent from "../material-ui/FileUploadComponent";
import { useDocumentType } from "@/hooks/api/document-type";
import LoadingComponent from "../tailwind/LoadingComponent";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, LinearProgress, Snackbar, TextField } from "@mui/material";
import { useEdgeStore } from "@/lib/edgestore";
import { useAuth } from "@/hooks/auth";
import { useSupplierDocument } from "@/hooks/api/supplier-document";
import { useContext } from "react";
import { SupplierDocumentContext } from "@/stores/SupplierDocumentContext";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const validationSchema = Yup.object({
  documentType: Yup.string()
    .required("Document Type is required")
    .test("notDefault", "Document Type is required", (value) => value !== "0"),
  fileDocument: Yup.mixed()
    .required("A file is required")
    .test(
      "fileFormat",
      "Only PDF files are allowed",
      (value) => value && value.type === "application/pdf"
    ),
});

function DocumentFormComponent({ setSnackbarMethod }) {
  const [documentFormState, setDocumentFormState] = useState({
    documentTypeData: [],
    loading: true,
    uploadProgress: 0,
    isExpirable: false,
  });

  const { index: getDocumentType } = useDocumentType();

  const { edgestore } = useEdgeStore();

  const { user } = useAuth({ middleware: "auth" });

  const { store } = useSupplierDocument();

  const {
    supplierDocumentState,
    setSupplierDocumentState,
    initialDocumentTypeInForm,
    setInitialDocumentTypeInForm,
  } = useContext(SupplierDocumentContext);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getDocumentType();
      setDocumentFormState((prevState) => ({
        ...prevState,
        documentTypeData: [
          { id: 0, name: "Select Document Type", disabled: true },
          ...data,
        ],
        loading: false,
      }));
    };

    fetchData();
  }, []);

  const initialValues = {
    documentType: initialDocumentTypeInForm || 0,
    fileDocument: null,
    expirationField: undefined,
  };

  const handleSubmit = async (values) => {
    setDocumentFormState((prevState) => ({ ...prevState, uploadProgress: 0 }));
    const uploadResponse = await handleUpload(values.fileDocument);
    if (!uploadResponse) {
      console.log(false);
    }
    const documentObject = {
      supplierId: 1,
      documentTypeId: values.documentType,
      fileName: values.fileDocument.name,
      filePath: uploadResponse.url,
      expiration: values.expirationField || null,
    };

    const { data: requestResponse } = await store(documentObject);

    setSnackbarMethod((prevState) => ({
      ...prevState,
      modal: false,
      snackbar: true,
      snackbarMessage: requestResponse
        ? "File saved successfully!"
        : "Something went wrong!",
      snackBarSeverity: requestResponse ? "success" : "error",
    }));
    setDocumentFormState((prevState) => ({ ...prevState, uploadProgress: 0 }));
    setSupplierDocumentState((prevState) => ({ ...prevState, reload: true }));
  };

  const handleUpload = async (file) => {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setDocumentFormState((prevState) => ({
            ...prevState,
            uploadProgress: progress,
          }));
        },
      });

      const resData = {
        url: res.url,
        size: res.size,
        uploadedAt: res.uploadedAt,
        metadata: res.metadata,
        path: res.path,
        pathOrder: res.pathOrder,
      };

      return resData;
    }
  };

  return (
    <div className="p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            {documentFormState.loading ? (
              <LoadingComponent label="Form is loading..." />
            ) : (
              <div className="flex flex-col gap-4 ">
                <div>
                  <Field
                    name="documentType"
                    as={SelectComponent}
                    label="Document Type"
                    data={documentFormState.documentTypeData}
                  ></Field>
                  <ErrorMessage
                    name="documentType"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <FileUploadComponent
                    id="fileDocument"
                    name="fileDocument"
                    onChange={(event) => {
                      setFieldValue(
                        "fileDocument",
                        event.currentTarget.files[0]
                      );
                    }}
                  />
                  <ErrorMessage
                    name="fileDocument"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() =>
                          setDocumentFormState((prevState) => ({
                            ...prevState,
                            isExpirable: !documentFormState.isExpirable,
                          }))
                        }
                      />
                    }
                    label="Expiration?"
                  />
                </div>

                {documentFormState.isExpirable && (
                  <div>
                    <Field
                      as={TextField}
                      id="expirationField"
                      name="expirationField"
                      variant="outlined"
                      label="Expiration Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={initialValues.expirationField}
                      onChange={(e) =>
                        setFieldValue("expirationField", e.target.value)
                      }
                    />
                  </div>
                )}

                {documentFormState.uploadProgress > 0 && (
                  <div className="flex flex-col justify-center">
                    <div className="mt-4">
                      <LinearProgress
                        variant="determinate"
                        value={documentFormState.uploadProgress}
                      />
                      <p>{documentFormState.uploadProgress}% uploaded</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button color="primary" variant="outlined" type="submit">
                    Save
                  </Button>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default DocumentFormComponent;
