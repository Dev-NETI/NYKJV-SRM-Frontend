"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";
import useSWR from "swr";
import StoreSupplierDrawer from "@/components/supplier/supplier-store";
import SupplierEdit from "@/components/supplier/supplier-edit";
import SupplierRead from "@/components/supplier/supplier-read";
import { Edit, Eye, Trash } from "lucide-react";
import {
  Box,
  Button,
  Card,
  Divider,
  Typography,
  Skeleton,
  FormControl,
  FormLabel,
  Input,
} from "@mui/joy";
import { Table, Sheet } from "@mui/joy";
import { UserContext } from "@/stores/UserContext";
import { useUser } from "@/hooks/api/user";
import Alert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import BasicModal from "@/components/Modal";

export default function DataTable() {
  const { index: getUsers, store: storeUser, update: updateUser } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [readSupplierId, setReadSupplierId] = useState(null);
  const [editSupplierId, setEditSupplierId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isReadDrawerOpen, setReadDrawerOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [userState, setUserState] = useState({
    userData: [],
    responseStore: true,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    lastPage: 1,
  });
  const [searchParams, setSearchParams] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false); // Added loading state from main

  const handleSearch = () => {
    const trimmedName = searchParams.name.trim();
    if (trimmedName === "") {
      console.log("Empty search input. Aborting.");
      return;
    }
    console.log("Searching for:", trimmedName);
    setPagination({ ...pagination, page: 1 });
    fetchSuppliers();
  };

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/supplier", {
        params: {
          name: searchParams.name,
          page: pagination.page,
          per_page: 10,
        },
      });

      if (response?.data?.suppliers) {
        setSuppliers(response.data.suppliers);
        setPagination({
          page: response.data.pagination.current_page,
          total: response.data.pagination.total,
          lastPage: response.data.pagination.last_page,
        });
      } else {
        setSuppliers([]);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams.name, pagination.page]);

  const fetcher = async (url) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error("Error fetching data from", url, error);
      return [];
    }
  };

  const { data: supplierData } = useSWR("/api/supplier", fetcher);
  const rows = React.useMemo(() => {
    if (!supplierData?.suppliers) return [];
    return supplierData.suppliers
      .filter((supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
        department: supplier?.department?.name || "Unknown",
        region: supplier?.region?.regDesc || "Unknown",
        province: supplier?.province?.provDesc || "Unknown",
        citymun: supplier?.citymun?.citymunDesc || "Unknown",
        brgy: supplier?.brgy?.brgyDesc || "Unknown",
        street_address: supplier.street_address,
      }));
  }, [supplierData, searchTerm]);

  const filteredRows =
    supplierData?.suppliers?.filter((supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  React.useEffect(() => {
    const totalPages = Math.ceil(filteredRows.length / pagination.perPage);
    if (pagination.lastPage !== totalPages) {
      setPagination((prev) => ({ ...prev, lastPage: totalPages || 1 }));
    }
  }, [filteredRows.length, pagination.perPage]);

  const paginatedRows = React.useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.perPage;
    const endIndex = startIndex + pagination.perPage;
    return rows.slice(startIndex, endIndex);
  }, [rows, pagination]);

  const handleAlert = () => {
    setDeleteAlert(true);
    setTimeout(() => {
      setDeleteAlert(false);
    }, 3000);
  };

  const handleRead = (id) => {
    setReadSupplierId(id);
    setEditSupplierId(null);
    setReadDrawerOpen(true);
  };

  const handleEdit = (id) => {
    setEditSupplierId(id);
    setReadSupplierId(null);
    setIsDrawerOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/supplier/${selectedSupplierId}`);
      const data = await fetcher("/api/supplier");
      setSuppliers(data.suppliers || []);
      handleAlert();
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to delete the supplier:", error);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedSupplierId(id);
    setModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    const totalPages = pagination.lastPage;
    if (newPage >= 1 && newPage <= totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const columns = [
    { field: "name", headerName: "Name", width: "15%" },
    { field: "department", headerName: "Department", width: "15%" },
    { field: "region", headerName: "Region", width: "5%" },
    { field: "province", headerName: "Province", width: "20%" },
    { field: "citymun", headerName: "City Municipality", width: "15%" },
    { field: "brgy", headerName: "Barangay", width: "15%" },
    { field: "street_address", headerName: "Street Address", width: "15%" },
    {
      field: "Action",
      width: "10%",
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap" }}>
          <button
            className="flex items-center bg-blue-600 p-2 rounded-md text-white"
            onClick={() => handleRead(params.row.id)}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="flex items-center bg-green-600 p-2 rounded-md text-white"
            onClick={() => handleEdit(params.row.id)}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="flex items-center bg-red-600 p-2 rounded-md text-white"
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(params.row.id);
            }}
          >
            <Trash className="w-4 h-4" />
          </button>
        </Box>
      ),
    },
  ];

  return (
    <>
      {supplierData ? (
        <UserContext.Provider value={{ setUserState, storeUser, updateUser }}>
          <Card variant="soft" sx={{ p: 2, mb: 2 }}>
            <Box
              sx={{
                borderBottom: "2px solid",
                borderColor: "primary.500",
                pb: 2,
                mb: 2,
              }}
            >
              <Typography level="h4" color="primary">
                Search Supplier
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <FormControl sx={{ minWidth: 200 }}>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Search by name..."
                  value={searchParams.name}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <Button
                variant="solid"
                color="primary"
                sx={{ alignSelf: "flex-end" }}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Box>
          </Card>
          <Card variant="soft" sx={{ p: 2 }}>
            <Box
              sx={{
                borderBottom: "2px solid",
                borderColor: "primary.500",
                pb: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography level="h4" color="primary">
                  List of Suppliers
                </Typography>
                <StoreSupplierDrawer />
              </Box>
            </Box>
            <Divider inset="none" />
            <Sheet
              sx={{
                width: "100%",
                overflow: "auto",
                borderRadius: "sm",
                mt: 2,
                display: "flex",
                flexDirection: "column",
                height: "70vh",
              }}
            >
              <Table
                borderAxis="bothBetween"
                size="md"
                stickyHeader
                variant="outlined"
                hoverRow
                sx={{
                  "--TableCell-headBackground":
                    "var(--joy-palette-background-level2)",
                  "--Table-headerUnderlineThickness": "1px",
                  "--TableRow-hoverBackground":
                    "var(--joy-palette-background-level1)",
                  "--TableCell-paddingY": "12px",
                  "--TableCell-paddingX": "16px",
                  minWidth: "1000px",
                  tableLayout: "fixed",
                  "& tbody": { bgcolor: "background.surface" },
                  "& thead th": {
                    fontWeight: "bold",
                    color: "text.primary",
                    backgroundColor: "var(--TableCell-headBackground)",
                    borderBottom: "2px solid var(--joy-palette-divider)",
                    whiteSpace: "normal",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                  "& tbody tr": { transition: "background-color 0.2s" },
                  "& td": {
                    color: "text.secondary",
                    padding: "12px",
                    whiteSpace: "normal",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 0,
                    "&[title]": { cursor: "pointer" },
                  },
                }}
              >
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.field} style={{ width: column.width }}>
                        {column.headerName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length > 0 ? (
                    paginatedRows.map((row) => (
                      <tr key={row.id}>
                        {columns.map((column) => (
                          <td
                            key={`${row.id}-${column.field}`}
                            title={column.renderCell ? null : row[column.field]}
                            sx={{ maxHeight: "100px", lineHeight: "1.5" }}
                          >
                            {column.renderCell
                              ? column.renderCell({ row })
                              : row[column.field]}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        style={{ textAlign: "center", padding: "16px" }}
                      >
                        No Data Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  justifyContent: "space-between",
                  p: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography level="body-sm" textColor="text.secondary">
                  {`Showing page ${pagination.page} of ${pagination.lastPage}`}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="sm"
                    variant="solid"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  {[...Array(pagination.lastPage)].map((_, index) => (
                    <Button
                      key={index + 1}
                      size="sm"
                      variant={
                        pagination.page === index + 1 ? "solid" : "outlined"
                      }
                      color={
                        pagination.page === index + 1 ? "primary" : "neutral"
                      }
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="solid"
                    disabled={pagination.page >= pagination.lastPage}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </Sheet>
          </Card>
          {deleteAlert && (
            <div className="fixed inset-x-0 bottom-[7rem] flex justify-center z-50">
              <Alert icon={<DeleteIcon fontSize="inherit" />} severity="error">
                Successfully Deleted
              </Alert>
            </div>
          )}
          <SupplierRead
            supplierId={readSupplierId}
            onClose={() => setReadDrawerOpen(false)}
            isOpen={isReadDrawerOpen}
          />
          <SupplierEdit
            supplierId={editSupplierId}
            onClose={() => setIsDrawerOpen(false)}
            isOpen={isDrawerOpen}
          />
          <BasicModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleDelete}
            title="Confirm Deletion"
            description="Are you sure you want to delete this supplier?"
          />
        </UserContext.Provider>
      ) : (
        <div>
          <Box
            sx={{
              bgcolor: "#A9A9A9",
              p: 2,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Skeleton
              sx={{ bgcolor: "#E5E4E2" }}
              variant="rectangular"
              width={1500}
              height={50}
              animation="wave"
            />
          </Box>
          <Box
            sx={{
              bgcolor: "#A9A9A9",
              p: 2,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            <Skeleton
              sx={{ bgcolor: "#E5E4E2" }}
              variant="rectangular"
              width={1500}
              height={1000}
              animation="wave"
            />
          </Box>
        </div>
      )}
    </>
  );
}