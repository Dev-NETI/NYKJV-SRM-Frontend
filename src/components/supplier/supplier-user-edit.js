import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  Button,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import {
  Person as PersonIcon,
  LocationCity as LocationCityIcon,
  ContactPhone as ContactPhoneIcon,
  Markunread as MarkunreadIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "@/lib/axios";

const FormSchema = z
  .object({
    company: z.string().min(1, "Required"),
    contact_person: z.string().min(1, "Required"),
    contact_number: z.string().min(1, "Required"),
    email_address: z.string().email("Invalid email format").min(1, "Required"),
    address:z.string().min(1, "Required"),
    products: z.string().min(1, "Required"),
  })
  .strict();

const SupplierUserStoreEdit = ({ supplierId, onClose, isOpen }) => {
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      company: "",
      contact_person: "",
      contact_number: "",
      email_address: "",
      address: "",
      products: "",
    },
  });

  useEffect(() => {
    if (!supplierId) {
      console.error("No supplier ID provided");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/supplier-user/${supplierId}`);
        console.log("Fetched supplier data:", response.data);
        if (response.data) {
          reset({
            company: response.data.company || "",
            contact_person: response.data.contact_person || "",
            contact_number: response.data.contact_number || "",
            email_address: response.data.email_address || "",
            address: response.data.address || "",
            products: response.data.products || "",
          });
          setInitialValues(response.data);
        } else {
          console.error("No supplier data found");
        }
      } catch (error) {
        console.error("Error fetching supplier:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supplierId, reset]);

  const submitForm = async (data) => {
    if (!supplierId) {
      alert("Invalid supplier ID. Cannot update.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`/api/supplier-user/${supplierId}`, data);
      console.log("Update response:", response);

      if (response.status === 200 || response.status === 204) {
        alert("Supplier information updated successfully!");
        onClose();
      } else {
        alert(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Update failed with error:", error.response?.data || error.message);
      alert(`Failed to update: ${error.response?.data?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: "500px" }} role="presentation">
        <Box className="p-4">
          <KeyboardDoubleArrowRightIcon
            sx={{ cursor: "pointer", color: "grey" }}
            onClick={onClose}
          />
        </Box>
        <Box className="p-6">
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Supplier
          </Typography>
          <Box className="mt-6">
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height={200} />
            ) : (
              <form onSubmit={handleSubmit(submitForm)}>
                <Grid container spacing={1}>
                  {[
                    {
                      name: "company",
                      label: "Company",
                      icon: <LocationCityIcon fontSize="lg" />,
                      type: "text",
                    },
                    {
                      name: "contact_person",
                      label: "Contact Person",
                      icon: <PersonIcon fontSize="lg" />,
                      type: "text",
                    },
                    {
                      name: "contact_number",
                      label: "Contact Number",
                      icon: <ContactPhoneIcon fontSize="lg" />,
                      type: "text",
                    },
                    {
                      name: "email_address",
                      label: "Email Address",
                      icon: <MarkunreadIcon fontSize="lg" />,
                      type: "email",
                    },
                    {
                      name: "address",
                      label: "Address",
                      icon: <MarkunreadIcon fontSize="lg" />,
                      type: "text",
                    },
                    {
                      name: "products",
                      label: "Products",
                      icon: <ShoppingCartIcon fontSize="lg" />,
                      type: "text",
                    },
                  ].map(({ name, label, icon, type }, idx) => (
                    <Grid item xs={12} key={idx}>
                      <Controller
                        name={name}
                        control={control}
                        render={({ field, fieldState }) => (
                          <div className="flex justify-between gap-4">
                            <div className="w-2/5 flex items-center gap-3 text-[#808080] cursor-pointer hover:bg-[#f8f4f4] rounded-md px-2">
                              {icon}
                              <span className="text-sm">{label}</span>
                            </div>
                            <div className="relative w-3/5">
                              <input
                                type={type}
                                className="w-full h-8 cursor-pointer hover:bg-[#f8f4f4] px-3"
                                placeholder="Empty"
                                {...field}
                              />
                              {fieldState.error && (
                                <Typography
                                  color="error"
                                  variant="caption"
                                  sx={{
                                    position: "absolute",
                                    right: "0",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "red",
                                  }}
                                >
                                  {fieldState.error.message}
                                </Typography>
                              )}
                            </div>
                          </div>
                        )}
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <div className="mt-5 flex gap-3">
                      <Button
                        sx={{
                          color: "black",
                          borderRadius: 2,
                          borderColor: "#808080",
                          border: "1px solid #808080",
                        }}
                        onClick={onClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        sx={{
                          color: "white",
                          borderRadius: 2,
                          backgroundColor: "#087ce4",
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </form>
            )}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SupplierUserStoreEdit;
