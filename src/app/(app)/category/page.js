// category

"use client";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import { useCategory } from "@/hooks/api/category";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Container,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid2,
  IconButton,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

const CategoryComponent = () => {
  const {
    index: showCategory,
    store,
    update: updateCategory,
    destroy: deactivateCategory,
  } = useCategory();
  const [categorys, setCategory] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [errors, setErrors] = useState({});
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [viewCategory, setViewCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state

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
    { field: "id", headerName: "ID", width: 5 },
    { field: "name", headerName: "Category Name", flex: 1, minWidth: 180 },
    { field: "modified_by", headerName: "Modified By", width: 180 },
    { field: "updated_at", headerName: "Updated At", width: 180 },
    { field: "created_at", headerName: "Created At", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="edit"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="view"
            color="info"
            size="small"
            onClick={() => handleView(params.row)}
            sx={{ ml: 1 }}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            aria-label="deactivate"
            color="error"
            size="small"
            onClick={() => handleDeactivate(params.row.id)}
            sx={{ ml: 1 }}
            disabled={deactivatingId === params.row.id}
          >
            {deactivatingId === params.row.id ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <DeleteIcon />
            )}
          </IconButton>
        </>
      ),
    },
  ];

  // Filter categorys based on the search query
  const filteredRows = categorys
    .filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((category) => ({
      id: category.id,
      name: category.name,
      modified_by: category.modified_by || "N/A",
      updated_at: category.updated_at
        ? new Date(category.updated_at).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "N/A",
      created_at: category.created_at
        ? new Date(category.created_at).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "N/A",
    }));

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleViewOpen = () => setViewOpen(true);
  const handleViewClose = () => setViewOpen(false);

  const resetForm = () => {
    setCategoryName("");
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

  const handleDeactivate = async (id) => {
    setDeactivatingId(id);
    try {
      await deactivateCategory(id);
      setCategory(categorys.filter((category) => category.id !== id));
      toast.success("Category deactivated successfully!");
    } catch (error) {
      console.error("Error deactivating category:", error);
      toast.error("Failed to deactivate category. Please try again.");
    } finally {
      setDeactivatingId(null);
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

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }

  function validateForm(object) {
    const errors = {};
    if (!object.categoryName)
      errors.categoryName = "Category Name is required.";
    return errors;
  }
  const paginationModel = { page: 0, pageSize: 10 };
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); // New state for selected categories
  const handleMultipleDeactivation = async () => {
    if (selectedCategoryIds.length === 0) {
      toast.error("No categories selected for deactivation.");
      return;
    }

    setDeactivatingId("multiple"); // Temporarily set a flag for multiple deactivations

    try {
      // Loop over the selectedCategoryIds and deactivate each category
      for (const id of selectedCategoryIds) {
        await deactivateCategory(id);
        // Remove the deactivated category from the state
        setCategory((prev) => prev.filter((category) => category.id !== id));
      }
      toast.success("Selected categories deactivated successfully!");
      setSelectedCategoryIds([]); // Clear selection after deactivation
    } catch (error) {
      console.error("Error deactivating categories:", error);
      toast.error("Failed to deactivate categories. Please try again.");
    } finally {
      setDeactivatingId(null); // Reset deactivating flag
    }
  };

  return (
    <>
      <Header title="Category" />
      {/* <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Box display="flex" justifyContent="center">
          <Paper sx={{ width: "100%", p: 2 }}>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <TextField
                variant="outlined"
                placeholder="Search Products"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mr: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Box display="flex">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpen}
                  sx={{ mr: 2 }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleMultipleDeactivation}
                  disabled={
                    selectedCategoryIds.length === 0 ||
                    deactivatingId === "multiple"
                  }
                >
                  {deactivatingId === "multiple" ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Deactivate"
                  )}
                </Button>
              </Box>
            </Box>

            <Box sx={{ p: 2 }}>
              <DataGrid
                rows={filteredRows}
                columns={columns}
                initialState={{
                  pagination: { paginationModel },
                }}
                pageSizeOptions={[5, 10, 20, 30, 40, 50]}
                checkboxSelection
                disableRowSelectionOnClick // This disables row selection when clicking anywhere else
                onRowSelectionModelChange={(ids) => setSelectedCategoryIds(ids)} // Track selected rows
                sx={{ border: 0 }}
              />
            </Box>
          </Paper>
        </Box>
        {/ Add/Edit Modal /}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {editingCategoryId ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium text-gray-600"
                >
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
                {errors.categoryName && (
                  <p className="text-red-500 text-sm">{errors.categoryName}</p>
                )}
              </div>
              {errors.form && (
                <p className="text-red-500 text-sm">{errors.form}</p>
              )}
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : editingCategoryId ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </Button>
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
            Category Details
          </DialogTitle>
          <DialogContent dividers>
            {viewCategory && (
              <Box p={2}>
                <Grid2 container spacing={2}>
                  <Grid2 item size={{ xs: 8 }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Category Name:</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                      {viewCategory.name || "N/A"}
                    </Typography>
                  </Grid2>
                  <Grid2 item size={{ xs: 4 }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Modified By:</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                      {viewCategory.modified_by || "N/A"}
                    </Typography>
                  </Grid2>
                  <Grid2 item size={{ xs: 6 }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Updated At:</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                      {viewCategory.updated_at
                        ? new Date(viewCategory.updated_at).toLocaleString()
                        : "N/A"}
                    </Typography>
                  </Grid2>
                  <Grid2 item size={{ xs: 6 }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Created At:</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                      {viewCategory.created_at
                        ? new Date(viewCategory.created_at).toLocaleString()
                        : "N/A"}
                    </Typography>
                  </Grid2>
                </Grid2>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleViewClose} color="error" variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer />
      </Container> */}
    </>
  );
};

export default CategoryComponent;
