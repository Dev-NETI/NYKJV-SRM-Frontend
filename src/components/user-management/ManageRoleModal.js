"use client";
import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  ModalClose,
  Sheet,
  Table,
  Typography,
} from "@mui/joy";
import { Fade } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { useRoles } from "@/hooks/api/roles";
import { useRolesUser } from "@/hooks/api/roles-user";

function ManageRoleModal({ user, showSnackbar }) {
  const [openAddModalRoles, setOpenAddModalRoles] = useState(false);
  const handleOpenAddModalRoles = () => setOpenAddModalRoles(true);
  const handleCloseAddModalRoles = () => setOpenAddModalRoles(false);

  const [DataState, setDataState] = useState({
    roles_data: [],
    roles_user_data: [],
  });

  const { show: getRolesData } = useRoles();

  const {
    store: addRoleUser,
    show: getRolesUserData,
    destroy: deleteRoleUser,
  } = useRolesUser();

  const fetchRolesData = useCallback(async () => {
    const response = await getRolesData(`available-roles/${user.id}`);
    setDataState((prevState) => ({
      ...prevState,
      roles_data: response.data,
    }));
  }, [user.id]);

  const fetchRolesUserData = useCallback(async () => {
    const response = await getRolesUserData(`current-user-roles/${user.id}`);
    setDataState((prevState) => ({
      ...prevState,
      roles_user_data: response.data,
    }));
  }, [user.id]);

  useEffect(() => {
    fetchRolesData();
    fetchRolesUserData();
  }, []);

  const handleAddRole = async (roleId) => {
    const response = await addRoleUser({
      user_id: user.id,
      role_id: roleId,
    });

    if (response.status === 201) {
      fetchRolesData();
      fetchRolesUserData();
      showSnackbar("Role added successfully!", "success");
    }
  };

  const handleDeleteRole = async (roleUserId) => {
    const response = await deleteRoleUser(roleUserId);

    if (response && response.status === 200) {
      fetchRolesData();
      fetchRolesUserData();
      showSnackbar("Role removed successfully!", "danger");
    } else {
      console.error("Failed to delete role user");
    }
  };

  return (
    <React.Fragment>
      <Button
        startDecorator={<PlusIcon />}
        variant="soft"
        onClick={handleOpenAddModalRoles}
      >
        Manage Roles
      </Button>
      <Modal
        open={openAddModalRoles}
        onClose={handleCloseAddModalRoles}
        aria-labelledby="manage-roles-modal"
        aria-describedby="modal-to-manage-roles"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Fade in={openAddModalRoles} mountOnEnter unmountOnExit>
          <Sheet
            variant="outlined"
            sx={{
              width: 1000,
              height: "80vh",
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                component="h2"
                id="modal-title"
                level="h4"
                textColor="inherit"
                fontWeight="lg"
              >
                Manage Roles
              </Typography>
              <ModalClose variant="plain" sx={{ m: 1 }} />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container>
              <Grid xs={12} md={12}>
                <Typography>
                  Current Roles ({DataState.roles_user_data.length})
                </Typography>
                <Table size="sm">
                  <thead>
                    <tr>
                      <th>Role Name</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {DataState.roles_user_data.length > 0 ? (
                      DataState.roles_user_data.map((role) => (
                        <tr key={role.role.id}>
                          <td>{role.role.name}</td>
                          <td className="text-end">
                            <Button
                              variant="outlined"
                              color="danger"
                              size="sm"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center">
                          No current roles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Grid>
              <Grid xs={12} md={12}>
                <br />
                <Typography>
                  Available Roles ({DataState.roles_data.length})
                </Typography>
                <Table size="sm">
                  <thead>
                    <tr>
                      <th>Role Name</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {DataState.roles_data.length > 0 ? (
                      DataState.roles_data.map((role) => (
                        <tr key={role.id}>
                          <td>{role.name}</td>
                          <td className="text-end">
                            <Button
                              variant="outlined"
                              color="success"
                              size="sm"
                              onClick={() => handleAddRole(role.id)}
                            >
                              Add
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center">
                          No available roles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Grid>
            </Grid>
          </Sheet>
        </Fade>
      </Modal>
    </React.Fragment>
  );
}

export default ManageRoleModal;
