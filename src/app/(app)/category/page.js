'use client';
import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { useCategory } from '@/hooks/api/category';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Container, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid2 } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const CategoryComponent = () => {
  const { index: showCategory, store, update: updateCategory, deleteCategory } = useCategory();
  const [categorys, setCategory] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [errors, setErrors] = useState({});
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [viewCategory, setViewCategory] = useState(null);

  useEffect(() => {
    const fetchCategorys = async () => {
      try {
        const response = await showCategory();
        if (response && response.data) {
          setCategory(response.data);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("Failed to fetch categorys:", error);
        toast.error("Failed to load categorys. Please try again later.");
      }
    };
    fetchCategorys();
  }, [showCategory]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 5 },
    { field: 'name', headerName: 'Category Name', flex: 1, minWidth: 180 },
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

  const rows = categorys.map((category) => ({
    id: category.id,
    name: category.name,
    modified_by: category.modified_by || "N/A",
    updated_at: category.updated_at ? new Date(category.updated_at).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) : "N/A",
    created_at: category.created_at ? new Date(category.created_at).toLocaleString('en-US', {
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
    setCategoryName('');
    setErrors({});
    setEditingCategoryId(null);
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setOpen(true);
  };

  const handleView = (category) => {
    setViewCategory(category);
    setViewOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategory(categorys.filter((category) => category.id !== id));
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category. Please try again.");
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
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, object);
        toast.success("Category updated successfully!");
      } else {
        await store(object);
        toast.success("Category added successfully!");
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting category:", error);
      if (error.response && error.response.status === 422) {
          setErrors(error.response.data.errors);
      } else {
          setErrors({ form: "An error occurred. Please try again." });
      }
    }
  }

  function validateForm(object) {
    const errors = {};
    if (!object.categoryName) errors.categoryName = 'Category Name is required.';
    return errors;
  }

  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <>
      <Header title="Category" />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Box display="flex" justifyContent="center">
          <Paper sx={{ width: '100%', p: 2 }}>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="primary" onClick={handleOpen}>
                Add Category
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

        {/* Add/Edit Modal */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>{editingCategoryId ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-600">
                  Category Name:
                </label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.categoryName && <p className="text-red-500 text-sm">{errors.categoryName}</p>}
              </div>
              {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
              <DialogActions>
                <Button onClick={handleClose} color="error" variant="contained" sx={{ fontWeight: 'bold' }}>Cancel</Button>
                <Button type="submit" color="primary" variant="contained" sx={{ fontWeight: 'bold' }}>{editingCategoryId ? 'Update' : 'Add'}</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={viewOpen} onClose={handleViewClose} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Category Details</DialogTitle>
          <DialogContent dividers>
            {viewCategory && (
              <Box p={2}>
                <Grid2 container spacing={2}>
                  <Grid2 item size={{ xs: 8}}>
                    <Typography variant="body2" color="textSecondary"><strong>Category Name:</strong></Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>{viewCategory.name || "N/A"}</Typography>
                  </Grid2>
                  <Grid2 item size={{ xs: 4}}>
                    <Typography variant="body2" color="textSecondary"><strong>Modified By:</strong></Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>{viewCategory.modified_by || "N/A"}</Typography>
                  </Grid2>
                  <Grid2 item size={{ xs: 6}}>
                    <Typography variant="body2" color="textSecondary"><strong>Updated At:</strong></Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>{viewCategory.updated_at ? new Date(viewCategory.updated_at).toLocaleString() : "N/A"}</Typography>
                  </Grid2>
                  <Grid2 item size={{ xs: 6}}>
                    <Typography variant="body2" color="textSecondary"><strong>Created At:</strong></Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>{viewCategory.created_at ? new Date(viewCategory.created_at).toLocaleString() : "N/A"}</Typography>
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

export default CategoryComponent;