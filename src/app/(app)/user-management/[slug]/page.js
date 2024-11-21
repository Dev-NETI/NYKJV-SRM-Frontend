"use client";

import { useUser } from "@/hooks/api/user";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Avatar,
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Container,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import { Grid } from "@mui/joy";
import ManageRoleModal from "../../../../components/user-management/ManageRoleModal";
import SBComponent from "@/components/snackbar/SBComponent";

function UserManagementSlugPage() {
  const params = useParams();
  const { showWithSlug: getUser } = useUser();
  const [user, setUser] = useState(null);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    color: "",
  });

  const showSnackbar1 = (message, color) => {
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
    const fetchData = async () => {
      try {
        const { data } = await getUser(params.slug);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [params.slug]);

  if (!user) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  return (
    <React.Fragment>
      <Container sx={{ my: 4 }}>
        <Card
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            p: 3,
            maxWidth: 800,
            mx: "auto",
          }}
        >
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                <PersonIcon fontSize="large" />
              </Avatar>
            }
            title={
              <Typography variant="h5" fontWeight="bold">
                {user.f_name} {user.l_name}
              </Typography>
            }
            subheader={
              <Typography color="textSecondary" variant="body1">
                {user.email}
              </Typography>
            }
            sx={{ mb: 2 }}
          />
          <Divider />

          {/* Roles Button */}
          <Box sx={{ textAlign: "right", p: 1 }}>
            <ManageRoleModal user={user} showSnackbar={showSnackbar1} />
          </Box>

          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Contact Number"
                      secondary={user.contact_number || "N/A"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Supplier"
                      secondary={user.supplier?.name || "N/A"}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Company"
                      secondary={user.company?.name || "N/A"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Department"
                      secondary={user.department?.name || "N/A"}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
          </CardContent>
        </Card>
      </Container>
      <SBComponent
        open={snackbarState.open}
        message={snackbarState.message}
        color={snackbarState.color}
      />
    </React.Fragment>
  );
}

export default UserManagementSlugPage;
