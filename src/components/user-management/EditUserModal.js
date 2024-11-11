"use client";
import {
  Box,
  Button,
  Divider,
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
  const handleOpenEditModal = () => setOpenEditModal(true);
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

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getUser(slug);
      setUser(response.data);
    };

    const fetchCompanyData = async () => {
      const response = await getCompanyData();
      setDataState((prevState) => ({
        ...prevState,
        company_data: response.data,
      }));
    };

    const fetchDepartmentData = async () => {
      const response = await getDepartmentData();
      setDataState((prevState) => ({
        ...prevState,
        department_data: response.data,
      }));
    };

    const fetchSupplierData = async () => {
      const response = await getSupplierData();
      setDataState((prevState) => ({
        ...prevState,
        supplier_data: response.data,
      }));
    };
    fetchUserData();
    fetchCompanyData();
    fetchDepartmentData();
    fetchSupplierData();
  }, []);

  return (
    <React.Fragment>
      {/* <Button
        startDecorator={<Edit />}
        variant="soft"
        onClick={handleOpenEditModal}
      ></Button> */}
      <Button
        startDecorator={<Edit />}
        variant="outlined" // Optional: use "outlined" or "contained" for visual distinction
        size="small" // Optional: "small" for compact styling
        sx={{ minWidth: "auto", padding: "4px" }}
        onClick={handleOpenEditModal}
      ></Button>
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
            <UserFormComponent
              mode={2}
              handleCloseEditModal={handleCloseEditModal}
              DataState={DataState}
              user={user}
            />
          </Sheet>
        </Slide>
      </Modal>
    </React.Fragment>
  );
}

export default EditUserModal;
