"use client";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/joy";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  CheckCircleOutline,
  BlockOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import { UserContext } from "@/stores/UserContext";
import { useUser } from "@/hooks/api/user";
import Loading from "../Loading";
import { UserIcon } from "lucide-react";
import AddUserModal from "./AddUserModal";
import SBComponent from "@/components/snackbar/SBComponent";

function page() {
  const { index: getUsers, store: storeUser } = useUser();
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
      field: "actions",
      width: 320,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          key={`action-buttons-${params.row.id}`} // Adding key to Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            mt: 1,
            mb: 1,
          }}
        >
          <Button
            key={`view-profile-${params.row.id}`}
            startDecorator={<UserIcon />}
            variant="soft"
            onClick={() => {
              // setSelectedSlug(params.row.slug);
              // handleOpenUpdateModal(true);
            }}
          >
            View Profile
          </Button>
          <Button
            key={`toggle-status-${params.row.id}`}
            variant="soft"
            color={params.row.is_active === "Active" ? "danger" : "success"}
            startDecorator={
              params.row.is_active === "Active" ? (
                <BlockOutlined />
              ) : (
                <CheckCircleOutline />
              )
            }
            onClick={async () => {
              try {
                if (params.row.is_active === "Active") {
                  // await destroyMealType(params.row.slug);
                } else {
                  // await patchMealType('activate/' + params.row.slug);
                }
                // setMealTypeState((prevState) => ({
                //   ...prevState,
                //   responseStore: true,
                // }));
              } catch (error) {
                // console.error('Error updating recipe status:', error);
              }
            }}
            sx={{
              borderColor:
                params.row.is_active === "Active"
                  ? "error.main"
                  : "success.main",
              "&:hover": {
                backgroundColor:
                  params.row.is_active === "Active"
                    ? "error.light"
                    : "success.light",
              },
            }}
          >
            {params.row.is_active === "Active" ? "Deactivate" : "Activate"}
          </Button>
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
      <UserContext.Provider value={{ setUserState, storeUser, showSnackbar }}>
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
