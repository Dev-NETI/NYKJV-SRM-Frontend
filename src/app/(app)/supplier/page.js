"use client";
import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import external_axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import StoreSupplierDrawer from "@/components/supplier/supplier-store";
import SupplierEdit from "@/components/supplier/supplier-edit";
import SupplierRead from "@/components/supplier/supplier-read";
import { Edit } from "lucide-react";
import { Trash } from "lucide-react";
import { Eye } from "lucide-react";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  Divider,
  Typography,
  FormControl,
  FormLabel,
  Input,
} from "@mui/joy";
import { Table, Sheet, Checkbox, IconButton, Select, Option } from "@mui/joy";
import { Search, Add as AddIcon, TrySharp } from "@mui/icons-material";
import { UserContext } from "@/stores/UserContext";
import { useUser } from "@/hooks/api/user";
import Loading from "../Loading";
import AddUserModal from "../../../components/user-management/AddUserModal";
import SBComponent from "@/components/snackbar/SBComponent";
import EditUserModal from "@/components/user-management/EditUserModal";
import { EyeIcon } from "lucide-react";
import Alert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import { setISODay } from "date-fns";

export default function DataTable() {
  const { index: getUsers, store: storeUser, update: updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [readSupplierId, setReadSupplierId] = useState(null);
  const [editSupplierId, setEditSupplierId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isReadDrawerOpen, setReadDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [apiRegion, setApiRegion] = useState([]);
  const [apiProvince, setApiProvince] = useState([]);
  const [apiDistrict, setApiDistrict] = useState([]);
  const [apiCity, setApiCity] = useState([]);
  const [apiMunicipality, setApiMunicipality] = useState([]);
  const [apiBrgy, setApiBrgy] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [userState, setUserState] = useState({
    userData: [],
    responseStore: true,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    lastPage: 1,
  });
  const [searchParams, setSearchParams] = useState({
    name: "", // Set initial value for name as an empty string
  });
  const handleSearch = () => {
    if (searchParams.name.trim() === "") {
      return;
    }
    // console.log("Search Query:", searchParams.name); // Debugging
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when search is triggered
    fetchSuppliers();
  };

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/supplier", {
        params: {
          name: searchParams.name, // Send the search term to backend
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
      // console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAlert = () => {
    setDeleteAlert(true);
    setTimeout(() => {
      setDeleteAlert(false);
    }, 3000);
  };

const handleRead = (id) => {
  setReadSupplierId(id);
  setEditSupplierId(null); // Reset edit state
  setReadDrawerOpen(true);
};

const handleEdit = (id) => {
  setEditSupplierId(id);
  setReadSupplierId(null); // Reset read state
  setIsDrawerOpen(true);
};



  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/supplier/${id}`);
      handleAlert();
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((supplier) => supplier.id !== id)
      );
    } catch (error) {
      if (error.response) {
        // console.error("Error response from server:", error.response.data.message);
      } else {
        // console.error("Error deleting supplier:", error.message);
      }
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: { xs: "5%", sm: "5%", md: "5%" },
    },
    {
      field: "name",
      headerName: "Name",
      width: { xs: "15%", sm: "15%", md: "15%" },
    },
    {
      field: "island",
      headerName: "Island",
      width: { xs: "15%", sm: "15%", md: "15%" },
    },
    {
      field: "region_id",
      headerName: "Region",
      width: { xs: "5%", sm: "5%", md: "5%" },
    },
    {
      field: "province_id",
      headerName: "Province",
      width: { xs: "20%", sm: "20%", md: "20%" },
    },
    {
      field: "district_id",
      headerName: "District",
      width: { xs: "15%", sm: "15%", md: "15%" },
    },
    {
      field: "city_id",
      headerName: "City",
      width: { xs: "15%", sm: "15%", md: "15%" },
    },
    {
      field: "municipality_id",
      headerName: "Municipality",
      width: { xs: "15%", sm: "15%", md: "15%" },
    },
    {
      field: "brgy_id",
      headerName: "Barangay",
      width: { xs: "15%", sm: "15%", md: "15%" },
    },

    {
      field: "street_address",
      headerName: "Street Address",
      width: { xs: "15%", sm: "15%", md: "15%" },
    },
    {
      field: "Action",
      width: { xs: "10%", sm: "10%", md: "10%" },
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "nowrap",
          }}
        >
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
              handleDelete(params.row.id);
            }}
          >
            <Trash className="w-4 h-4" />
          </button>
        </Box>
      ),
    },
  ];

  const convertedRegion = async () => {
    try {
      const response = await external_axios.get(
        "https://psgc.gitlab.io/api/regions/"
      );
      // console.log("Fetched Regions:", response.data);

      const regions = response.data.map((region) => ({
        id: region.code,
        name: region.name,
      }));
      setApiRegion(regions);
    } catch (error) {
      // console.error("Error fetching regions from the API:", error);
    }
  };

  const convertedProvince = async () => {
    try {
      const response = await external_axios.get(
        "https://psgc.gitlab.io/api/provinces/"
      );
      // console.log("Fetched Provinces:", response.data);
      const provinces = response.data.map((province) => ({
        id: province.code,
        name: province.name,
      }));
      setApiProvince(provinces);
    } catch (error) {
      // console.log("Error fetching province", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const convertedDistrict = async () => {
    try {
      const response = await external_axios.get(
        "https://psgc.gitlab.io/api/districts/"
      );
      // console.log("Fetched Districts", response.data);

      const districts = response.data.map((district) => ({
        id: district.code,
        name: district.name,
      }));
      setApiDistrict(districts);
    } catch (error) {
      // console.log("Error fetching district", error);
    }
  };

  const convertedCity = async () => {
    try {
      const response = await external_axios.get(
        "https://psgc.gitlab.io/api/cities/"
      );
      // console.log("Fetched City", response.data);

      const cities = response.data.map((city) => ({
        id: city.code,
        name: city.name,
      }));
      setApiCity(cities);
    } catch (error) {
      // console.log("Fetched City", error);
    }
  };

  const convertedMunicipality = async () => {
    try {
      const response = await external_axios.get(
        "https://psgc.gitlab.io/api/municipalities/"
      );
      // console.log("Fetched Municipality", response.data);

      const municipalities = response.data.map((municipality) => ({
        id: municipality.code,
        name: municipality.name,
      }));
      setApiMunicipality(municipalities);
    } catch (error) {
      // console.log("Error fetching municipality", error);
    }
  };

  const convertedBrgy = async () => {
    try {
      const response = await external_axios.get(
        "https://psgc.gitlab.io/api/barangays/"
      );
      // console.log("Fetched Barangay", response.data);

      const barangays = response.data.map((brgy) => ({
        id: brgy.code,
        name: brgy.name,
      }));
      setApiBrgy(barangays);
    } catch (error) {
      // console.log("Error fetching barangay", error);
    }
  };

  const rows = suppliers.map((supplier) => {
    const paddedRegionId = supplier.region_id
      ? String(supplier.region_id).padStart(9, "0")
      : "";
    const paddedProvinceId = supplier.province_id
      ? String(supplier.province_id).padStart(9, "0")
      : "";
    const paddedDistrictId = supplier.district_id
      ? String(supplier.district_id).padStart(9, "0")
      : "";
    const paddedCityId = supplier.city_id
      ? String(supplier.city_id).padStart(9, "0")
      : "";
    const paddedMunicipalityId = supplier.municipality_id
      ? String(supplier.municipality_id).padStart(9, "0")
      : "";
    const paddedBarangayId = supplier.brgy_id
      ? String(supplier.brgy_id).padStart(9, "0")
      : "None";

    const region = apiRegion.find((region) => region.id === paddedRegionId);
    const province = apiProvince.find(
      (province) => province.id === paddedProvinceId
    );
    const district = apiDistrict.find(
      (district) => district.id === paddedDistrictId
    );
    const city = apiCity.find((city) => city.id === paddedCityId);
    const municipality = apiMunicipality.find(
      (municipality) => municipality.id === paddedMunicipalityId
    );
    const brgy = apiBrgy.find((brgy) => brgy.id === paddedBarangayId);

    return {
      id: supplier.id,
      name: supplier.name,
      island: supplier.island,
      region_id: region ? region.name : "None",
      province_id: province ? province.name : "None",
      district_id: district ? district.name : "None",
      city_id: city ? city.name : "None",
      municipality_id: municipality ? municipality.name : "None",
      brgy_id: brgy ? brgy.name : "None",
      street_address: supplier.street_address,
      slug: supplier.slug,
    };
  });

  useEffect(() => {
    fetchSuppliers();
    convertedRegion();
    convertedProvince();
    convertedDistrict();
    convertedCity();
    convertedMunicipality();
    convertedBrgy();
  }, [pagination.page]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography level="h4" color="primary">
                Search Users
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <FormControl sx={{ minWidth: 200 }}>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Search by name..."
                startDecorator={<Search />}
                value={searchParams.name}
                onChange={(e) =>
                  setSearchParams({ name: e.target.value.trim() })
                } // No need to call .trim() here
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </FormControl>
            <Button
              variant="solid"
              color="primary"
              sx={{ alignSelf: "flex-end" }}
              startDecorator={<Search />}
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
                List of Users
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
                "& tbody": {
                  bgcolor: "background.surface",
                },
                "& thead th": {
                  fontWeight: "bold",
                  color: "text.primary",
                  backgroundColor: "var(--TableCell-headBackground)",
                  borderBottom: "2px solid var(--joy-palette-divider)",
                  whiteSpace: "normal",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
                "& tbody tr": {
                  transition: "background-color 0.2s",
                },
                "& td": {
                  color: "text.secondary",
                  padding: "12px",
                  whiteSpace: "normal",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 0,
                  "&[title]": {
                    cursor: "pointer",
                  },
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
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <tr key={row.id}>
                      {columns.map((column) => (
                        <td
                          key={`${row.id}-${column.field}`}
                          title={column.renderCell ? null : row[column.field]}
                          sx={{
                            maxHeight: "100px",
                            lineHeight: "1.5",
                          }}
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
                  onClick={() => handlePageChange(pagination.page - 1)} // Decrease page
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
                    onClick={() => handlePageChange(index + 1)} // Go to specific page
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="solid"
                  disabled={pagination.page >= pagination.lastPage}
                  onClick={() => handlePageChange(pagination.page + 1)} // Increase page
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Sheet>
        </Card>
        {deleteAlert ? (
          <div className="fixed inset-x-0 bottom-[7rem] flex justify-center z-50">
            <Alert icon={<DeleteIcon fontSize="inherit" />} severity="error">
              Successfully Deleted
            </Alert>
          </div>
        ) : null}
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
      </UserContext.Provider>
    </>
  );
}
