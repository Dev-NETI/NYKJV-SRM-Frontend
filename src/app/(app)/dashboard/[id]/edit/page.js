"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { TextField, Button, Grid, Typography, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  island_id: z
    .number()
    .max(100, { message: "Island ID must be a positive number" }),
  province_id: z
    .number()
    .max(100, { message: "Province ID must be a positive number" }),
  municipality_id: z
    .number()
    .max(100, { message: "Municipality ID must be a positive number" }),
  brgy_id: z
    .number()
    .max(100, { message: "Barangay ID must be a positive number" }),
  street_address: z.string().min(1, { message: "Street Address is required" }),
});

const EditSupplier = () => {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [display, setDisplay] = useState(true)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
  });
  useEffect(() => {
    const fetchSupplier = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`/api/dashboard/${id}`);
        const supplierData = response.data;
        // Populate form with fetched data
        setValue("name", supplierData.name);
        setValue("island_id", supplierData.island_id);
        setValue("province_id", supplierData.province_id);
        setValue("municipality_id", supplierData.municipality_id);
        setValue("brgy_id", supplierData.brgy_id);
        setValue("street_address", supplierData.street_address);
      } catch (err) {
        console.error(
          "Error fetching supplier data:",
          err.response ? err.response.data : err.message
        );
        setError(
          "Error fetching supplier data. Please check the console for details."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id, setValue]);
  const onSubmit = async (data) => {
    setError("");
    setSuccess("");
    try {
      const response = await axios.put(`/api/dashboard/${id}`, data);
      setSuccess('Supplier updated successfully');
      setTimeout(() => {
        setSuccess('')
      }, 2000)
    } catch (err) {
      console.error(
        "Error updating supplier:",
        err.response ? err.response.data : err.message
      );
      setError(
        "Error updating supplier. Please check the console for details."
      );
    }
  };
  if (loading) {
    return (
      <div className="w-full h-screen">
        <Box className="w-full h-full p-[2em]">
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
      </div>
    );
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <Typography variant="h4" gutterBottom>
        Edit Supplier
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Island ID"
              fullWidth
              type="number"
              {...register("island_id", { valueAsNumber: true })}
              error={!!errors.island_id}
              helperText={errors.island_id?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Province ID"
              fullWidth
              type="number"
              {...register("province_id", { valueAsNumber: true })}
              error={!!errors.province_id}
              helperText={errors.province_id?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Municipality ID"
              fullWidth
              type="number"
              {...register("municipality_id", { valueAsNumber: true })}
              error={!!errors.municipality_id}
              helperText={errors.municipality_id?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Barangay ID"
              fullWidth
              type="number"
              {...register("brgy_id", { valueAsNumber: true })}
              error={!!errors.brgy_id}
              helperText={errors.brgy_id?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Street Address"
              fullWidth
              {...register("street_address")}
              error={!!errors.street_address}
              helperText={errors.street_address?.message}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Update Supplier
        </Button>
      </form>
      {success && <Alert severity="success">{success}</Alert>}
    </div>
  );
};

export default EditSupplier;
