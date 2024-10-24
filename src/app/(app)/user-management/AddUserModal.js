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
import { PlusIcon } from "lucide-react";
import UserFormComponent from "@/components/user-management/UserFormComponent";
import { useCompanies } from "@/hooks/api/companies";
import { useDepartment } from "@/hooks/api/department";
import { useSupplier } from "@/hooks/api/supplier";

function AddUserModal() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const [DataState, setDataState] = useState({
    company_data: [],
    department_data: [],
    supplier_data: [],
  });

  const { index: getCompanyData } = useCompanies();
  const { index: getDepartmentData } = useDepartment();
  const { index: getSupplierData } = useSupplier();

  useEffect(() => {
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

    fetchCompanyData();
    fetchDepartmentData();
    fetchSupplierData();
  }, []);

  return (
    <React.Fragment>
      <Button
        startDecorator={<PlusIcon />}
        variant="soft"
        onClick={handleOpenAddModal}
      >
        Add User
      </Button>
      <Modal
        open={openAddModal}
        onClose={handleCloseAddModal}
        aria-labelledby="add-user-modal"
        aria-describedby="modal-to-add-new-user"
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
        }}
      >
        <Slide direction="left" in={openAddModal} mountOnEnter unmountOnExit>
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
                Add New User
              </Typography>
              <ModalClose variant="plain" sx={{ m: 1 }} />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <UserFormComponent
              mode={1}
              handleCloseAddModal={handleCloseAddModal}
              DataState={DataState}
            />
          </Sheet>
        </Slide>
      </Modal>
    </React.Fragment>
  );
}

export default AddUserModal;
