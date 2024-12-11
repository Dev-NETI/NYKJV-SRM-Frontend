"use client";
import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import StoreSupplierDrawer from "@/components/supplier/supplier-store";
import SupplierEdit from "@/components/supplier/supplier-edit";
import { Edit } from "lucide-react";
import { Trash } from "lucide-react";

export default function DataTable() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [editSupplierId, setEditSupplierId] = useState(null); // State to hold supplier ID for editing
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // New state to control drawer open/close

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("/api/supplier");
      setSuppliers(response.data.suppliers || []);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setError("Failed to load suppliers");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/supplier/${id}`);
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((supplier) => supplier.id !== id)
      );
      setSnackbarMessage("Supplier deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting supplier:", error);
      setSnackbarMessage("Failed to delete supplier");
      setSnackbarOpen(true);
    }
  };

  const handleEdit = (id) => {
    setEditSupplierId(id);
    setIsDrawerOpen(true); // Open drawer when editing
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const columns = [
    { field: "name", headerName: "Name", width: 300 },
    { field: "island", headerName: "Island", width: 130 },
    { field: "region_id", headerName: "Region", width: 130 },
    { field: "city_id", headerName: "City", width: 130 },
    { field: "brgy_id", headerName: "Barangay", width: 130 },
    { field: "street_address", headerName: "Street Address", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div className="flex justify-center items-center gap-2 mt-2 ">
          <button
            className="flex items-center bg-green-600 p-2 rounded-md text-white"
            onClick={() => handleEdit(params.id)} // Open drawer and set supplier ID on edit
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="flex items-center bg-red-600 p-2 rounded-md text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.id);
            }}
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      {loading ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
          }}
        >
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </Box>
      ) : (
        <>
          <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
            <StoreSupplierDrawer />
          </Box>
          <Paper sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={suppliers}
              columns={columns}
              pageSizeOptions={[5, 10]}
              components={{ Toolbar: GridToolbar }}
              sx={{ border: 0 }}
            />
          </Paper>
        </>
      )}
      {snackbarMessage && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      )}
      <SupplierEdit
        supplierId={editSupplierId}
        onClose={() => setIsDrawerOpen(false)}
        isOpen={isDrawerOpen} // Pass open state
      />
    </Container>
  );
}
