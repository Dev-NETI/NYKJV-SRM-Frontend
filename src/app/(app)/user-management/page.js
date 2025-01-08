"use client";
import React, { useEffect, useState } from "react";
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
import { Table, Sheet, IconButton } from "@mui/joy";
import { Search, Add as AddIcon, DeleteForever } from "@mui/icons-material";
import { UserContext } from "@/stores/UserContext";
import { useUser } from "@/hooks/api/user";
import Loading from "../Loading";
import AddUserModal from "../../../components/user-management/AddUserModal";
import SBComponent from "@/components/snackbar/SBComponent";
import EditUserModal from "@/components/user-management/EditUserModal";
import { EyeIcon } from "lucide-react";
import DeleteConfirmationModal from "@/components/user-management/DeleteUserModal";
import axios from "axios";

function Page() {
  const { index: getUsers, store: storeUser, update: updateUser } = useUser();

  const { patch: patchUser } = useUser("soft-delete");
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    color: "",
  });
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
    f_name: "",
    l_name: "",
  });

  const showSnackbar = (message, color) => {
    setSnackbarState({
      open: true,
      message,
      color,
    });
  };

  const [openModal, setOpenModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);

  const handleDelete = async (slug) => {
    try {
      // Await the patchUser function to complete
      const { data } = await patchUser(slug);

      // Reload the users list after the patch request is successful
      await setUserState((prevState) => ({
        ...prevState,
        responseStore: true,
      }));

      console.log("Item deleted with id:", data);
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("Error deleting item:", error);
    }
  };

  const handleOpenModal = (slug) => {
    setItemIdToDelete(slug);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setItemIdToDelete(null);
  };

  // Auto-close snackbar after a few seconds (optional)
  setTimeout(() => {
    setSnackbarState((prevState) => ({
      ...prevState,
      open: false,
    }));
  }, 5000); // 3 seconds

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await getUsers({
          page: pagination.page,
          f_name: searchParams.f_name,
          l_name: searchParams.l_name,
          company_info: true,
          department_info: true,
          supplier_info: true,
        });
        setUserState((prevState) => ({
          ...prevState,
          userData: data.data,
          responseStore: false,
        }));
        setPagination((prev) => ({
          ...prev,
          total: data.total,
          lastPage: data.last_page,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userState.responseStore) {
      fetchUserData();
    }
  }, [
    userState.responseStore,
    pagination.page,
    getUsers,
    searchParams.f_name,
    searchParams.l_name,
  ]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: { xs: "5%", sm: "5%", md: "5%" },
    },
    {
      field: "f_name",
      headerName: "First Name",
      width: { xs: "15%", sm: "15%", md: "15%" },
    },
    {
      field: "m_name",
      headerName: "Middle Name",
      width: { xs: "15%", sm: "15%", md: "15%" },
    },
    {
      field: "l_name",
      headerName: "Last Name",
      width: { xs: "15%", sm: "15%", md: "15%" },
    },
    {
      field: "suffix",
      headerName: "Suffix",
      width: { xs: "5%", sm: "5%", md: "5%" },
    },
    {
      field: "company_id",
      headerName: "Company",
      width: { xs: "20%", sm: "20%", md: "20%" },
    },
    {
      field: "modified_by",
      headerName: "Modified By",
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
          key={`action-buttons-${params.row.id}`}
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "nowrap", // Prevent buttons from wrapping
          }}
        >
          <Link href={`/user-management/${params.row.slug}`} passHref>
            <IconButton
              key={`view-profile-${params.row.slug}`}
              variant="solid"
              size="sm"
              color="primary"
            >
              <EyeIcon />
            </IconButton>
          </Link>
          <EditUserModal slug={params.row.slug} />

          <IconButton
            variant="solid"
            color="danger"
            size="sm"
            onClick={() => handleOpenModal(params.row.slug)} // Pass the id of the item to delete
          >
            <DeleteForever />
          </IconButton>
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
    company_id: user.company?.name || "N/A",
    modified_by: user.modified_by || "N/A",
    slug: user.slug,
  }));

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when searching
    setUserState((prev) => ({ ...prev, responseStore: true }));
  };

  return (
    <>
      <UserContext.Provider
        value={{ setUserState, storeUser, showSnackbar, updateUser }}
      >
        <Card
          variant="soft"
          sx={{ p: 2, mb: 2 }}
          className="animate-in fade-in duration-700"
        >
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
              <FormLabel>First Name</FormLabel>
              <Input
                placeholder="Search by first name..."
                startDecorator={<Search />}
                value={searchParams.f_name}
                onChange={(e) => {
                  setSearchParams((prev) => ({
                    ...prev,
                    f_name: e.target.value,
                  }));
                }}
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <FormLabel>Last Name</FormLabel>
              <Input
                placeholder="Search by last name..."
                startDecorator={<Search />}
                value={searchParams.l_name}
                onChange={(e) => {
                  setSearchParams((prev) => ({
                    ...prev,
                    l_name: e.target.value,
                  }));
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

        <Card
          variant="soft"
          sx={{ p: 2 }}
          className="animate-in fade-in duration-700"
        >
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
              <AddUserModal />
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
                  backgroundColor: "#fff",
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
                {rows.map((row) => (
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
                ))}
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
                  onClick={() => {
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
                    setUserState((prev) => ({ ...prev, responseStore: true }));
                  }}
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
                    onClick={() => {
                      setPagination((prev) => ({ ...prev, page: index + 1 }));
                      setUserState((prev) => ({
                        ...prev,
                        responseStore: true,
                      }));
                    }}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="solid"
                  disabled={pagination.page >= pagination.lastPage}
                  onClick={() => {
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
                    setUserState((prev) => ({ ...prev, responseStore: true }));
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Sheet>
        </Card>
        <SBComponent
          open={snackbarState.open}
          message={snackbarState.message}
          color={snackbarState.color}
        />

        <DeleteConfirmationModal
          open={openModal}
          onClose={handleCloseModal}
          handleDelete={handleDelete}
          id={itemIdToDelete}
        />
      </UserContext.Provider>
    </>
  );
}

export default Page;
