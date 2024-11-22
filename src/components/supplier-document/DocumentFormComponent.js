import React, { useEffect, useState } from "react";
import SelectComponent from "../material-ui/SelectComponent";
import FileUploadComponent from "../material-ui/FileUploadComponent";
import { useDocumentType } from "@/hooks/api/document-type";
import LoadingComponent from "../tailwind/LoadingComponent";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@mui/material";

const validationSchema = Yup.object({
  documentType: Yup.string().required("Document Type is required"),
  fileDocument: Yup.mixed()
    .required("A file is required")
    .test(
      "fileFormat",
      "Only PDF files are allowed",
      (value) => value && value.type === "application/pdf"
    ),
});

function DocumentFormComponent() {
  const [documentFormState, setDocumentFormState] = useState({
    documentTypeData: [],
    loading: true,
  });
  const { index: getDocumentType } = useDocumentType();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getDocumentType();
      setDocumentFormState((prevState) => ({
        ...prevState,
        documentTypeData: data,
        loading: false,
      }));
    };

    fetchData();
  }, []);

  const initialValues = {
    documentType: 1,
    fileDocument: null,
  };
  const handleSubmit = (values) => {
    console.log(values);
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
                  />
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
