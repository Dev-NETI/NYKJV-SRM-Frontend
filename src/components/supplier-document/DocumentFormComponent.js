import axios from "@/lib/axios";
import React, { useEffect, useState } from "react";
import SelectComponent from "../material-ui/SelectComponent";
import FileUploadComponent from "../material-ui/FileUploadComponent";
import { useDocumentType } from "@/hooks/api/document-type";
import LoadingComponent from "../tailwind/LoadingComponent";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@mui/material";

const validationSchema = Yup.object({
  documentType: Yup.string()
    .required("Document Type is required")
    .test("notDefault", "Document Type is required", (value) => value !== "0"),
  fileDocument: Yup.mixed()
    .required("A file is required")
    .test(
      "fileFormat",
      "Only PDF files are allowed",
      (value) => value && value.type === "application/pdf",
    ),
});

function DocumentFormComponent() {
  const [documentFormState, setDocumentFormState] = useState({
    documentTypeData: [],
    loading: true,
  });
  
  const { index: getDocumentType } = useDocumentType();
  
  const { edgestore } = useEdgeStore();
  
  const { user } = useAuth({ middleware: "auth" });
  
  const { store } = useSupplierDocument();
  
  const { supplierDocumentState, setSupplierDocumentState, initialDocumentTypeInForm, setInitialDocumentTypeInForm } = useContext(
    SupplierDocumentContext,
  );
  
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
                        event.currentTarget.files[0],
                      );
                    }}
                  />
                  <ErrorMessage
                    name="fileDocument"
                    component="div"
                    className="text-red-600"
                  />
                </div>

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