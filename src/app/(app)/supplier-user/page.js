"use client";

import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import StoreSupplierUserDrawer from "@/components/supplier/supplier-user-store";
import SupplierUserStoreEdit from "@/components/supplier/supplier-user-edit";
import { Edit } from "lucide-react";
import { Trash } from "lucide-react";

export default function DataTable() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [editSupplierId, setEditSupplierId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("/api/supplier-user");
      setSuppliers(response.data.suppliers || []);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setError("Failed to load suppliers");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplierId) => {
    console.log("Edit supplier ID:", supplierId); // Debugging log
    if (supplierId) {
      setEditSupplierId(supplierId);
      setIsDrawerOpen(true);
    }
  };

  const handleDelete = async (supplierId) => {
    try {
      await axios.delete(`/api/supplier-user/${supplierId}`);
      setSuppliers((prev) =>
        prev.filter((supplier) => supplier.id !== supplierId)
      );
      setSnackbarMessage("Supplier deleted successfully.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting supplier:", error);
      setSnackbarMessage("Failed to delete supplier.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const columns = [
    { field: "company", headerName: "Company", width: 150 },
    { field: "contact_person", headerName: "Contact Person", width: 150 },
    { field: "contact_number", headerName: "Contact Number", width: 150 },
    { field: "email_address", headerName: "Email Address", width: 200 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "products", headerName: "Products", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div className="flex justify-center items-center gap-2 mt-2">
          <button
            className="flex items-center bg-green-600 p-2 rounded-md text-white"
            onClick={() => handleEdit(params.id)}
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
            <StoreSupplierUserDrawer />
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
      <SupplierUserStoreEdit
        supplierId={editSupplierId} // Check that this is properly set
        onClose={() => setIsDrawerOpen(false)}
        isOpen={isDrawerOpen}
      />
    </Container>
  );
}
