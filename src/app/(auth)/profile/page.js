"use client";
import React from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { useAuth } from "@/hooks/auth";
import * as Yup from "yup";
import { TextField, Button, Typography } from "@mui/material";
import { useUser } from "@/hooks/api/user";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

function Page() {
  const { user } = useAuth({ middleware: "auth" });
  const { store: updateUser } = useUser("update-profile");
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .required("First name is required")
      .max(50, "First name must be at most 50 characters"),
    middlename: Yup.string()
      .max(50, "Middle name must be at most 50 characters")
      .nullable(),
    lastname: Yup.string()
      .required("Last name is required")
      .max(50, "Last name must be at most 50 characters"),
    suffix: Yup.string()
      .max(10, "Suffix must be at most 10 characters")
      .nullable(),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string()
      .optional()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: Yup.string()
      .optional()
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const initialData = {
    firstname: user?.f_name || "",
    middlename: user?.m_name || "",
    lastname: user?.l_name || "",
    suffix: user?.suffix || "",
    contactNumber: user?.contact_number || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    values.userId = user?.id;
    const { data: response } = await updateUser(values);

    response ? toast.success(response.message) : toast.error(response.message);
    router.push("/product");
    setSubmitting(false);
    resetForm();
  };

  return (
    <div>
      {!user ? (
        <p>Loading</p>
      ) : (
        <Formik
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting, errors }) => (
            <Form>
              <div className="flex flex-col gap-2">
                <div>
                  <Typography variant="subtitle1">Firstname</Typography>
                  <Field
                    as={TextField}
                    id="firstname"
                    name="firstname"
                    sx={{ width: 500 }}
                    onChange={(event) =>
                      setFieldValue("firstname", event.target.value)
                    }
                  />
                  <ErrorMessage
                    name="firstname"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div>
                  <Typography variant="subtitle1">Middlename</Typography>
                  <Field
                    as={TextField}
                    id="middlename"
                    name="middlename"
                    sx={{ width: 500 }}
                    onChange={(event) =>
                      setFieldValue("middlename", event.target.value)
                    }
                  />
                  <ErrorMessage
                    name="middlename"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div>
                  <Typography variant="subtitle1">Lastname</Typography>
                  <Field
                    as={TextField}
                    id="lastname"
                    name="lastname"
                    sx={{ width: 500 }}
                    onChange={(event) =>
                      setFieldValue("lastname", event.target.value)
                    }
                  />
                  <ErrorMessage
                    name="lastname"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div>
                  <Typography variant="subtitle1">Suffix</Typography>
                  <Field
                    as={TextField}
                    id="suffix"
                    name="suffix"
                    sx={{ width: 500 }}
                    onChange={(event) =>
                      setFieldValue("suffix", event.target.value)
                    }
                  />
                  <ErrorMessage
                    name="suffix"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div>
                  <Typography variant="subtitle1">Contact Number</Typography>
                  <Field
                    as={TextField}
                    id="contactNumber"
                    name="contactNumber"
                    sx={{ width: 500 }}
                    onChange={(event) =>
                      setFieldValue("contactNumber", event.target.value)
                    }
                  />
                  <ErrorMessage
                    name="contactNumber"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div>
                  <Typography variant="subtitle1">Email</Typography>
                  <Field
                    as={TextField}
                    id="email"
                    name="email"
                    sx={{ width: 500 }}
                    onChange={(event) =>
                      setFieldValue("email", event.target.value)
                    }
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div>
                  <Typography variant="subtitle1">Password</Typography>
                  <Field
                    as={TextField}
                    id="password"
                    name="password"
                    sx={{ width: 500 }}
                    type="password"
                    onChange={(event) =>
                      setFieldValue("password", event.target.value)
                    }
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div>
                  <Typography variant="subtitle1">Confirm Password</Typography>
                  <Field
                    as={TextField}
                    id="confirmPassword"
                    name="confirmPassword"
                    sx={{ width: 500 }}
                    type="password"
                    onChange={(event) =>
                      setFieldValue("confirmPassword", event.target.value)
                    }
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div className="flex justify-end">
                  <Button variant="contained" type="submit" sx={{ width: 200 }}>
                    {isSubmitting ? "Updating" : "Update"}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
      <ToastContainer />
    </div>
  );
}

export default Page;
