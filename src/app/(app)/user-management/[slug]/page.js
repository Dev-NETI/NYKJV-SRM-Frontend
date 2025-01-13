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
  }, []);

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
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
            borderRadius: 3,
            p: 4,
            maxWidth: 900,
            mx: "auto",
            backgroundColor: "#ffffff",
          }}
        >
          <CardHeader
            avatar={
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 80,
                  height: 80,
                  boxShadow: "0 4px 12px 0 rgba(0,0,0,0.15)",
                }}
              >
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
            }
            title={
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                {user.f_name} {user.l_name}
              </Typography>
            }
            subheader={
              <Typography
                color="textSecondary"
                variant="h6"
                sx={{ opacity: 0.8 }}
              >
                {user.email}
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          <Divider sx={{ my: 2, opacity: 0.7 }} />

          {/* Roles Button */}
          <Box sx={{ textAlign: "right", p: 2 }}>
            <ManageRoleModal user={user} showSnackbar={showSnackbar1} />
          </Box>

          <Divider sx={{ my: 2, opacity: 0.7 }} />

          <CardContent sx={{ pt: 4 }}>
            <Grid container spacing={4}>
              <Grid xs={12} md={6}>
                <List>
                  <ListItem
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      mb: 2,
                      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.05)",
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Contact Number
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" fontWeight="medium">
                          {user.contact_number || "N/A"}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      mb: 2,
                      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.05)",
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Supplier
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" fontWeight="medium">
                          {user.supplier?.name || "N/A"}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid xs={12} md={6}>
                <List>
                  <ListItem
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      mb: 2,
                      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.05)",
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Company
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" fontWeight="medium">
                          {user.company?.name || "N/A"}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      mb: 2,
                      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.05)",
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Department
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" fontWeight="medium">
                          {user.department?.name || "N/A"}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
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
