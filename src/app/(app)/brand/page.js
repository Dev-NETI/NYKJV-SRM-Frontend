"use client";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import { useBrand } from "@/hooks/api/brand";
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
import { useAuth } from "@/hooks/auth";

const BrandComponent = () => {
  const {
    index: showBrand,
    store,
    update: updateBrand,
    destroy: deactivateBrand,
  } = useBrand();
  const [brands, setBrand] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [errors, setErrors] = useState({});
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [viewBrand, setViewBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state
  const { user } = useAuth({ middleware: "auth" });

  const fetchBrandData = async () => {
    const { data } = await showBrand();
    setBrand(data);
  };

  useEffect(() => {
    if (brands.length === 0) {
      fetchBrandData();
    }
  }, [brands, fetchBrandData]);

  const columns = [
    { field: "id", headerName: "ID", width: 5 },
    { field: "name", headerName: "Brand Name", flex: 1, minWidth: 180 },
    { field: "modified_by", headerName: "Modified By", width: 180 },
    { field: "updated_at", headerName: "Updated At", width: 180 },
    { field: "created_at", headerName: "Created At", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          {user?.supplier_id && (
            <IconButton
              aria-label="edit"
              color="primary"
              size="small"
              onClick={() => handleEdit(params.row)}
            >
              <EditIcon />
            </IconButton>
          )}

          <IconButton
            aria-label="view"
            color="info"
            size="small"
            onClick={() => handleView(params.row)}
            sx={{ ml: 1 }}
          >
            <VisibilityIcon />
          </IconButton>
          {user?.supplier_id && (
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
          )}
        </>
      ),
    },
  ];

  // Filter brands based on the search query
  const filteredRows = brands
    .filter((brand) =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((brand) => ({
      id: brand.id,
      name: brand.name,
      modified_by: brand.modified_by || "N/A",
      updated_at: brand.updated_at
        ? new Date(brand.updated_at).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "N/A",
      created_at: brand.created_at
        ? new Date(brand.created_at).toLocaleString("en-US", {
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
    setBrandName("");
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

  const handleDeactivate = async (id) => {
    setDeactivatingId(id);
    try {
      await deactivateBrand(id);
      setBrand(brands.filter((brand) => brand.id !== id));
      toast.success("Brand deactivated successfully!");
    } catch (error) {
      console.error("Error deactivating brand:", error);
      toast.error("Failed to deactivate brand. Please try again.");
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
    if (editingBrandId) {
      const { data: updateResponse } = await updateBrand(
        editingBrandId,
        object
      );
      updateResponse
        ? (toast.success("Brand updated successfully!"), fetchBrandData())
        : toast.error("Something went wrong!");
    } else {
      const { data: storeResponse } = await store(object);
      storeResponse
        ? (toast.success("Brand added successfully!"), fetchBrandData())
        : toast.error("Something went wrong!");
    }
    setLoading(false);
    handleClose();
  }

  function validateForm(object) {
    const errors = {};
    if (!object.brandName) errors.brandName = "Brand Name is required.";
    return errors;
  }
  const [selectedBrandIds, setSelectedBrandIds] = useState([]); // New state for selected brands
  const paginationModel = { page: 0, pageSize: 10 };
  const handleMultipleDeactivation = async () => {
    if (selectedBrandIds.length === 0) {
      toast.error("No brands selected for deactivation.");
      return;
    }

    setDeactivatingId("multiple"); // Temporarily set a flag for multiple deactivations

    try {
      // Loop over the selectedBrandIds and deactivate each brand
      for (const id of selectedBrandIds) {
        await deactivateBrand(id);
        // Remove the deactivated brand from the state
        setBrand((prev) => prev.filter((brand) => brand.id !== id));
      }
      toast.success("Selected brands deactivated successfully!");
      setSelectedBrandIds([]); // Clear selection after deactivation
    } catch (error) {
      console.error("Error deactivating brands:", error);
      toast.error("Failed to deactivate brands. Please try again.");
    } finally {
      setDeactivatingId(null); // Reset deactivating flag
    }
  };

  return (
    <>
      <Header title="Brand" />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
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
                {user?.supplier_id && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                    sx={{ mr: 2 }}
                  >
                    Add
                  </Button>
                )}

                <Button
                  variant="contained"
                  color="error"
                  onClick={handleMultipleDeactivation}
                  disabled={
                    selectedBrandIds.length === 0 ||
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
                onRowSelectionModelChange={(ids) => setSelectedBrandIds(ids)} // Track selected rows
                sx={{ border: 0 }}
              />
            </Box>
          </Paper>
        </Box>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {editingBrandId ? "Edit Brand" : "Add Brand"}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="brandName"
                  className="block text-sm font-medium text-gray-600"
                >
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
                {errors.brandName && (
                  <p className="text-red-500 text-sm">{errors.brandName}</p>
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
                  ) : editingBrandId ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

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
                  <Grid2 item size={{ xs: 8 }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Brand Name:</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                      {viewBrand.name || "N/A"}
                    </Typography>
                  </Grid2>
                  <Grid2 item size={{ xs: 4 }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Modified By:</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                      {viewBrand.modified_by || "N/A"}
                    </Typography>
                  </Grid2>
                  <Grid2 item size={{ xs: 6 }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Updated At:</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                      {viewBrand.updated_at
                        ? new Date(viewBrand.updated_at).toLocaleString()
                        : "N/A"}
                    </Typography>
                  </Grid2>
                  <Grid2 item size={{ xs: 6 }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Created At:</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                      {viewBrand.created_at
                        ? new Date(viewBrand.created_at).toLocaleString()
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
      </Container>
    </>
  );
};

export default BrandComponent;
