"use client";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  ModalClose,
  Sheet,
  Typography,
} from "@mui/joy";
import { Slide } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Edit, User2Icon } from "lucide-react";
import { useCompanies } from "@/hooks/api/companies";
import { useDepartment } from "@/hooks/api/department";
import { useSupplier } from "@/hooks/api/supplier";
import UserFormComponent from "./UserFormComponent";
import { useUser } from "@/hooks/api/user";

function EditUserModal({ slug }) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const handleOpenEditModal = () => {
    setOpenEditModal(true);
    setUser(null);
    fetchUserData();
  };
  const handleCloseEditModal = () => setOpenEditModal(false);
  const [user, setUser] = useState();

  const [DataState, setDataState] = useState({
    company_data: [],
    department_data: [],
    supplier_data: [],
  });

  const { showWithSlug: getUser } = useUser();
  const { index: getCompanyData } = useCompanies();
  const { index: getDepartmentData } = useDepartment();
  const { index: getSupplierData } = useSupplier();

  const fetchUserData = async () => {
    try {
      const response = await getUser(slug);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, departmentRes, supplierRes] = await Promise.all([
          getCompanyData(),
          getDepartmentData(),
          getSupplierData(),
        ]);

        setDataState({
          company_data: companyRes.data,
          department_data: departmentRes.data,
          supplier_data: supplierRes.data,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <IconButton
        key={`edit-user-${slug}`}
        variant="solid"
        size="sm"
        onClick={handleOpenEditModal}
      >
        <Edit />
      </IconButton>
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-user-modal"
        aria-describedby="modal-to-edit-user"
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
        }}
      >
        <Slide direction="left" in={openEditModal} mountOnEnter unmountOnExit>
          <Sheet
            variant="outlined"
            sx={{
              width: 400,
              height: "100vh",
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
                Submit Changes
              </Typography>
              <ModalClose variant="plain" sx={{ m: 1 }} />
            </Box>
            <Divider sx={{ mb: 2 }} />
            {user ? (
              <UserFormComponent
                mode={2}
                handleCloseEditModal={handleCloseEditModal}
                DataState={DataState}
                user={user}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Typography>Loading...</Typography>
              </Box>
            )}
          </Sheet>
        </Slide>
      </Modal>
    </React.Fragment>
  );
}

export default EditUserModal;
