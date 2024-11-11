"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../Header";
import { Box, Button, Card, Divider, Typography } from "@mui/joy";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { InfoOutlined } from "@mui/icons-material";
import { UserContext } from "@/stores/UserContext";
import { useUser } from "@/hooks/api/user";
import Loading from "../Loading";
import AddUserModal from "../../../components/user-management/AddUserModal";
import SBComponent from "@/components/snackbar/SBComponent";
import EditUserModal from "@/components/user-management/EditUserModal";
import { EyeIcon } from "lucide-react";

function page() {
  const { index: getUsers, store: storeUser, update: updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    color: "",
  });
  const [userState, setUserState] = useState({
    userData: [],
    responseStore: true,
  });

  const showSnackbar = (message, color) => {
    setSnackbarState({
      open: true,
      message,
      color,
    });
  };

  // Auto-close snackbar after a few seconds (optional)
  setTimeout(() => {
    setSnackbarState((prevState) => ({
      ...prevState,
      open: false,
    }));
  }, 3000); // 3 seconds

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const { data } = await getUsers();
        setUserState((prevState) => ({
          ...prevState,
          userData: data,
          responseStore: false,
        }));
      } catch (error) {
        // console.error('Error fetching meal type data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (userState.responseStore) {
      fetchUserData();
    }
  }, [userState.responseStore, getUsers]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "f_name", headerName: "First Name", flex: 1, minWidth: 100 },
    { field: "m_name", headerName: "Middle Name", flex: 1, minWidth: 100 },
    { field: "l_name", headerName: "Last Name", flex: 1, minWidth: 100 },
    { field: "suffix", headerName: "Suffix", flex: 1, minWidth: 70 },
    {
      field: "is_active",
      headerName: "Status",
      width: 180,
    },
    { field: "modified_by", headerName: "Modified By", width: 150 },
    { field: "updated_at", headerName: "Updated At", width: 180 },
    {
      field: "Action",
      width: 320,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box key={`action-buttons-${params.row.id}`} sx={{ py: 1 }}>
          <Link href={`/user-management/${params.row.slug}`} passHref>
            <Button
              key={`view-profile-${params.row.slug}`}
              startDecorator={<EyeIcon />}
              variant="outlined" // Optional: use "outlined" or "contained" for visual distinction
              size="small" // Optional: "small" for compact styling
              sx={{ minWidth: "auto", padding: "4px", mr: 1 }}
            ></Button>
          </Link>
          <EditUserModal slug={params.row.slug} />
        </Box>
      ),
    },
  ];

  const rows = userState.userData.map((user, index) => ({
    id: index + 1,
    f_name: user.f_name,
    m_name: user.m_name,
    l_name: user.l_name,
    suffix: user.suffix,
    is_active: user.is_active === 0 ? "Inactive" : "Active",
    modified_by: user.modified_by || "N/A",
    updated_at: new Date(user.updated_at).toLocaleString(),
    slug: user.slug,
  }));

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <UserContext.Provider
        value={{ setUserState, storeUser, showSnackbar, updateUser }}
      >
        <Header title={"User Management"} />
        <Card
          variant="outlined"
          sx={{
            maxHeight: "max-content",
            maxWidth: "90%",
            mx: "auto",
            resize: "horizontal",
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography level="title-lg" startDecorator={<InfoOutlined />}>
              List of Users
            </Typography>
            <AddUserModal />
          </Box>
          <Divider inset="none" />
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            components={{
              Toolbar: GridToolbar,
            }}
            sx={{
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
          />
        </Card>
        <SBComponent
          open={snackbarState.open}
          message={snackbarState.message}
          color={snackbarState.color}
        />
      </UserContext.Provider>
    </>
  );
}

export default page;
