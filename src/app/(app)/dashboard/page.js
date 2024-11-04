"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import Header from "@/app/(app)/Header";
import Button from "@/components/Button";
import { Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import BasicModal from "@/components/Modal"; 

const Dashboard = () => {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [success, setSuccess] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("/dashboard");
        const supplierData = response.data.suppliers || [];
        setSuppliers(supplierData);
        setFilteredSuppliers(supplierData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setError("Failed to load suppliers");
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = suppliers.filter(
      (supplier) =>
        supplier.name?.toLowerCase().includes(query) ||
        supplier.street_address?.toLowerCase().includes(query)
    );
    setFilteredSuppliers(filtered);
    setCurrentPage(1);
  };

  // Calculate total pages
  // Calculate total pages
  const totalPages = Math.max(
    Math.ceil(filteredSuppliers.length / itemsPerPage),
    1
  );

  // Slice filtered suppliers for the current page
  const currentSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEditClick = (id) => {
    router.push(`/dashboard/${id}/edit`);
    console.log("Editing supplier with ID", id);
  };

  // Function to open delete confirmation modal
  const handleDeleteClick = (id) => {
    setSelectedSupplierId(id);
    setIsModalOpen(true);
  };

  // Function to delete supplier after confirmation
  const confirmDelete = async () => {
    try {
      await axios.delete(`/dashboard/${selectedSupplierId}`);
      setSuppliers((prev) =>
        prev.filter((supplier) => supplier.id !== selectedSupplierId)
      );
      setFilteredSuppliers((prev) =>
        prev.filter((supplier) => supplier.id !== selectedSupplierId)
      );
      setIsModalOpen(false);
      setSuccess("Supplier deleted successfully");
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Failed to delete supplier");
    }
  };

  return (
    <>
      <Header title="Supplier Management System" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="flex justify-between items-center px-4 py-2">
              <Button onClick={() => router.push("/dashboard/store")}>
                Add Supplier
              </Button>
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={handleSearch}
                className="border rounded-2xl w-1/2 p-2"
              />
              <div className="flex justify-center items-center mt-4">
                <span className="mx-2">{`${currentPage} of ${totalPages}`}</span>
                <Button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="bg-transparent hover:bg-transparent"
                >
                  <ChevronLeftIcon className="text-black" />
                </Button>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="bg-transparent hover:bg-transparent"
                >
                  <ChevronRightIcon className="text-black" />
                </Button>
              </div>
            </div>
            {loading && (
              <div className="w-full h-full">
                <Box className="w-full h-full p-[2em]">
                  <Skeleton />
                  <Skeleton animation="wave" />
                  <Skeleton animation={false} />
                </Box>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="text-center">Name</TableCell>
                  <TableCell className="text-center">Island ID</TableCell>
                  <TableCell className="text-center">Province ID</TableCell>
                  <TableCell className="text-center">Municipality ID</TableCell>
                  <TableCell className="text-center">Barangay ID</TableCell>
                  <TableCell className="text-center">Street Address</TableCell>
                  <TableCell className="text-center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentSuppliers.length > 0
                  ? currentSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>

                        <TableCell className="text-center">
                          {supplier.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {supplier.island_id}
                        </TableCell>
                        <TableCell className="text-center">
                          {supplier.province_id}
                        </TableCell>
                        <TableCell className="text-center">
                          {supplier.municipality_id}
                        </TableCell>
                        <TableCell className="text-center">
                          {supplier.brgy_id}
                        </TableCell>
                        <TableCell className="text-center">
                          {supplier.street_address}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditClick(supplier.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteClick(supplier.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  : !loading && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No suppliers available.
                        </TableCell>
                      </TableRow>
                    )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && <Alert severity="success">{success}</Alert>}
        </div>
      </div>
      {/* Modal for delete confirmation */}
      {isModalOpen && (
        <BasicModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          description="Are you sure you want to delete this supplier?"
        />
      )}
    </>
  );
};

export default Dashboard;
