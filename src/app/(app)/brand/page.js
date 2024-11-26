'use client';
import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { useBrand } from '@/hooks/api/brand';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Container, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid2 } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const BrandComponent = () => {
  const { index: showBrand, store, update: updateBrand, deleteBrand } = useBrand();
  const [brands, setBrand] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [errors, setErrors] = useState({});
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [viewBrand, setViewBrand] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await showBrand();
        if (response && response.data) {
          setBrand(response.data);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        toast.error("Failed to load brands. Please try again later.");
      }
    };
    fetchBrands();
  }, [showBrand]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 5 },
    { field: 'name', headerName: 'Brand Name', flex: 1, minWidth: 180 },
    { field: 'modified_by', headerName: 'Modified By', width: 180 },
    { field: 'updated_at', headerName: 'Updated At', width: 180 },
    { field: 'created_at', headerName: 'Created At', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 240,
      renderCell: (params) => (
        <>
          <Button variant="outlined" color="primary" size="small" onClick={() => handleEdit(params.row)}>Edit</Button>
          <Button variant="outlined" color="info" size="small" onClick={() => handleView(params.row)} sx={{ ml: 1 }}>View</Button>
          <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(params.row.id)} sx={{ ml: 1 }}>Delete</Button>
        </>
      ),
    },
  ];

  const rows = brands.map((brand) => ({
    id: brand.id,
    name: brand.name,
    modified_by: brand.modified_by || "N/A",
    updated_at: brand.updated_at ? new Date(brand.updated_at).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) : "N/A",
    created_at: brand.created_at ? new Date(brand.created_at).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) : "N/A",
  }));

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleViewOpen = () => setViewOpen(true);
  const handleViewClose = () => setViewOpen(false);

  const resetForm = () => {
    setBrandName('');
    setErrors({});
    setEditingBrandId(null);
  };

  const handleEdit = (brand) => {
    setEditingBrandId(brand.id);
    setBrandName(brand.name);
    setOpen(true);
  };

  const handleView = (brand) => {
    setViewBrand(brand);
    setViewOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBrand(id);
      setBrand(brands.filter((brand) => brand.id !== id));
      toast.success("Brand deleted successfully!");
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("Failed to delete brand. Please try again.");
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const object = Object.fromEntries(formData.entries());

    const validationErrors = validateForm(object);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      if (editingBrandId) {
        await updateBrand(editingBrandId, object);
        toast.success("Brand updated successfully!");
      } else {
        await store(object);
        toast.success("Brand added successfully!");
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting brand:", error);
      if (error.response && error.response.status === 422) {
          setErrors(error.response.data.errors);
      } else {
          setErrors({ form: "An error occurred. Please try again." });
      }
    }
  }

  function validateForm(object) {
    const errors = {};
    if (!object.brandName) errors.brandName = 'Brand Name is required.';
    return errors;
  }

  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <>
      <Header title="Brand" />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Box display="flex" justifyContent="center">
          <Paper sx={{ width: '100%', p: 2 }}>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="primary" onClick={handleOpen}>
                Add Brand
              </Button>
            </Box>
            <Box sx={{ p: 2 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 15, 20]}
                checkboxSelection
                sx={{ border: 0 }}
              />
            </Box>
          </Paper>
        </Box>
        {/ Add/Edit Modal /}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>{editingBrandId ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="brandName" className="block text-sm font-medium text-gray-600">
                  Brand Name:
                </label>
                <input
                  type="text"
                  id="brandName"
                  name="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.brandName && <p className="text-red-500 text-sm">{errors.brandName}</p>}
              </div>
              {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
              <DialogActions>
                <Button onClick={handleClose} color="error" variant="contained" sx={{ fontWeight: 'bold' }}>Cancel</Button>
                <Button type="submit" color="primary" variant="contained" sx={{ fontWeight: 'bold' }}>{editingBrandId ? 'Update' : 'Add'}</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
        {/ View Modal /}
        <Dialog
          open={viewOpen}
          onClose={handleViewClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            Brand Details
          </DialogTitle>
          <DialogContent dividers>
            {viewBrand && (
              <Box p={2}>
                <Grid2 container spacing={2}>
                  <Grid2 item size={{ xs: 8}}>
                    <Typography variant="body2" color="textSecondary"><strong>Brand Name:</strong></Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>{viewBrand.name || "N/A"}</Typography>
                  </Grid2>
                  <Grid2 item size={{ xs: 4}}>
                    <Typography variant="body2" color="textSecondary"><strong>Modified By:</strong></Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>{viewBrand.modified_by || "N/A"}</Typography>
                  </Grid2>
                  <Grid2 item size={{ xs: 6}}>
                    <Typography variant="body2" color="textSecondary"><strong>Updated At:</strong></Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>{viewBrand.updated_at ? new Date(viewBrand.updated_at).toLocaleString() : "N/A"}</Typography>
                  </Grid2>
                  <Grid2 item size={{ xs: 6}}>
                    <Typography variant="body2" color="textSecondary"><strong>Created At:</strong></Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>{viewBrand.created_at ? new Date(viewBrand.created_at).toLocaleString() : "N/A"}</Typography>
                  </Grid2>
                </Grid2>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleViewClose} color="error" variant="contained">Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
      <ToastContainer />
    </>
  );
};

export default BrandComponent;
