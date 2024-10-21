"use client";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import { useProduct } from "@/hooks/api/product";
import { useBrand } from "@/hooks/api/brand";
import { useCategory } from "@/hooks/api/category";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Container,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid2,
  Typography,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ProductComponent = () => {
  const {
    index: showProduct,
    store,
    update: updateProduct,
    destroy : deactivateProduct,
  } = useProduct();
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false); // State for add/edit modal
  const [viewOpen, setViewOpen] = useState(false); // State for view modal
  const [viewProduct, setViewProduct] = useState({}); // Product to view
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productSpecification, setProductSpecification] = useState("");
  const [errors, setErrors] = useState({});
  const [editingProductId, setEditingProductId] = useState(null); // ID for editing a product

  const { index: showBrand } = useBrand();
  const [brandItems, setBrand] = useState([]);

  const { index: showCategory } = useCategory();
  const [categoryItems, setCategory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: brandData } = await showBrand();
        const { data: categoryData } = await showCategory();
        const { data: productData } = await showProduct();
        setBrand(brandData);
        setCategory(categoryData);
        setProducts(productData);
      } catch (error) {
        toast.error("Failed to load categorys. Please try again later.");
      }
    };

    fetchData();
  }, [showBrand, showCategory, showProduct]);

  const columns = [
    { field: "id", headerName: "ID", width: 5 },
    { field: "name", headerName: "Product Name", flex: 1, minWidth: 180 },
    { field: "category_name", headerName: "Category", width: 200 },
    { field: "brand_name", headerName: "Brand", width: 200 },
    { field: "price", headerName: "Price", width: 100 },
    {
      field: "specification",
      headerName: "Specification",
      width: 250,
    },
    // { field: "modified_by", headerName: "Modified By", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="edit"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="view"
            color="info"
            size="small"
            onClick={() => handleView(params.row)}
            sx={{ ml: 1 }}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            aria-label="deactivate"
            color="error"
            size="small"
            onClick={() => handleDeactivate(params.row.id)}
            sx={{ ml: 1 }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };
  const rows = products.map((product) => ({
    id: product.id,
    category_name: product.category.name,
    brand_name: product.brand.name,
    category_id: product.category_id,
    brand_id: product.brand_id,
    name: product.name,
    price: product.price,
    specification: product.specification,
    modified_by: product.modified_by,
    updated_at: new Date(product.updated_at).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    created_at: new Date(product.created_at).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  }));

  const handleOpen = () => setOpen(true); // Open add/edit modal
  const handleClose = () => {
    setOpen(false);
    resetForm(); // Reset the form when modal is closed
  };

  const resetForm = () => {
    setProductName("");
    setProductCategory("");
    setProductBrand("");
    setProductPrice("");
    setProductSpecification("");
    setErrors({});
    setEditingProductId(null); // Reset editing ID
  };

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setProductName(product.name);
    setProductCategory(product.category_id); // Ensure this matches the category ID
    setProductBrand(product.brand_id); // Ensure this matches the brand ID
    setProductPrice(product.price);
    setProductSpecification(product.specification);
    setOpen(true);
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateProduct(id); // Call the deactivate function from your API hook
      setProducts(products.filter((product) => product.id !== id));
      toast.success("Product deactivated successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to deactivated product. Please try again.");
    }
  };

  const handleView = (product) => {
    setViewProduct(product);
    setViewOpen(true);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const object = Object.fromEntries(formData.entries());

    const validationErrors = validateForm(object);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, object); // Update product if editing
        toast.success("Product updated successfully!");
      } else {
        await store(object); // Add new product
        toast.success("Product added successfully!");
      }
      handleClose(); // Close the modal and reset form
    } catch (error) {
      console.error("Error submitting product:", error);
      if (error.response && error.response.status === 422) {
          setErrors(error.response.data.errors);
      } else {
          setErrors({ form: "An error occurred. Please try again." });
      }
    }
  }

  function validateForm(object) {
    const errors = {};
    if (!object.productName) errors.productName = "Product Name is required.";
    if (!object.productPrice) {
      errors.productPrice = "Product Price is required.";
    } else if (isNaN(object.productPrice)) {
      errors.productPrice = "Product Price must be a number.";
    }
    if (!object.productSpecification)
      errors.productSpecification = "Product Specification is required.";
    if (!object.productCategory)
      errors.productCategory = "Please select a category.";
    if (!object.productBrand) errors.productBrand = "Please select a category.";

    return errors;
  }

  return (
    <>
      <Header title="Product" />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Box display="flex" justifyContent="center">
          <Paper sx={{ width: "100%", p: 2 }}>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="primary" onClick={handleOpen}>
                Add Product
              </Button>
            </Box>
            <Box sx={{ p: 2 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 20, 30, 40, 50]}
                checkboxSelection
                sx={{ border: 0 }}
              />
            </Box>
          </Paper>
        </Box>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {editingProductId ? "Edit Product" : "Add Product"}
          </DialogTitle>
          <DialogContent>
            <Box>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Grid2 container spacing={2}>
                  <Grid2 item size={{ xs: 8 }}>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Product Name:</strong>
                    </Typography>
                    <item sx={{ fontSize: "1.1rem" }}>
                      <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </item>
                    {errors.productName && (
                      <p className="text-red-500 text-sm">
                        {errors.productName}
                      </p>
                    )}
                  </Grid2>

                  <Grid2 item size={{ xs: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Price:</strong>
                    </Typography>
                    <item sx={{ fontSize: "1.1rem" }}>
                      <input
                        type="text"
                        id="productPrice"
                        name="productPrice"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </item>
                    {errors.productPrice && (
                      <p className="text-red-500 text-sm">
                        {errors.productPrice}
                      </p>
                    )}
                  </Grid2>

                  <Grid2 item size={{ xs: 6 }}>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Category:</strong>
                    </Typography>
                    <item sx={{ fontSize: "1.1rem" }}>
                      <select
                        id="productCategory"
                        name="productCategory"
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a category</option>
                        {categoryItems.map(({ id, name }) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </item>
                    {errors.productCategory && (
                      <p className="text-red-500 text-sm">
                        {errors.productCategory}
                      </p>
                    )}
                  </Grid2>


                  <Grid2 item size={{ xs: 6 }}>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Brand:</strong>
                    </Typography>
                    <item sx={{ fontSize: "1.1rem" }}>
                      <select
                        id="productBrand"
                        name="productBrand"
                        value={productBrand} // Update this state variable accordingly
                        onChange={(e) => setProductBrand(e.target.value)} // Update the state function accordingly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a brand</option>
                        {brandItems.map(({ id, name }) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </item>
                    {errors.productBrand && (
                      <p className="text-red-500 text-sm">
                        {errors.productBrand}
                      </p>
                    )}
                  </Grid2>

                  <Grid2 item size={{ xs: 12 }}>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Specification:</strong>
                    </Typography>
                    <item sx={{ fontSize: "1.1rem" }}>
                      <textarea
                        id="productSpecification"
                        name="productSpecification"
                        value={productSpecification}
                        onChange={(e) =>
                          setProductSpecification(e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </item>
                    {errors.productSpecification && (
                      <p className="text-red-500 text-sm">
                        {errors.productSpecification}
                      </p>
                    )}
                  </Grid2>
                </Grid2>
                {errors.form && (
                  <p className="text-red-500 text-sm">{errors.form}</p>
                )}
                <div className="pt-2 flex justify-end">
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      variant="contained"
                      color="error"
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                    <Button variant="contained" color="primary" type="submit">
                      {" "}
                      {editingProductId ? "Update Product" : "Add Product"}
                    </Button>
                  </DialogActions>
                </div>
              </form>
            </Box>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            Product Details
          </DialogTitle>
          <DialogContent dividers>
            {viewProduct && (
              <Box p={2}>
                <Grid2 container spacing={2}>
                  <Grid2 item size={{ xs: 12 }}>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Product Name:</strong>
                    </Typography>
                    <item sx={{ fontSize: "1.1rem" }}>
                      {viewProduct.name || "N/A"}
                    </item>
                  </Grid2>
                  <Grid2 item size={{ xs: 6 }}>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Category:</strong>
                    </Typography>
                    <item sx={{ fontSize: "1.1rem" }}>
                      {viewProduct.category_name || "N/A"}
                    </item>
                  </Grid2>
                  <Grid2 item size={{ xs: 6 }}>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Brand:</strong>
                    </Typography>
                    <item sx={{ fontSize: "1.1rem" }}>
                      {viewProduct.brand_name || "N/A"}
                    </item>
                  </Grid2>
                  <Grid2 item size={{ xs: 6 }}>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Price:</strong>
                    </Typography>
                    <item sx={{ fontSize: "1.1rem" }}>
                      {viewProduct.price || "N/A"}
                    </item>
                  </Grid2>
                  <Grid2 item size={{ xs: 6 }}>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Specification:</strong>
                    </Typography>
                    <item sx={{ fontSize: "1.1rem" }}>
                      {viewProduct.specification || "N/A"}
                    </item>
                  </Grid2>
                  <Grid2 item size={{ xs: 6 }}>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Modified By:</strong>
                    </Typography>
                    <item sx={{ fontSize: "1.1rem" }}>
                      {viewProduct.modified_by || "N/A"}
                    </item>
                  </Grid2>
                  <Grid2 item size={{ xs: 6 }}>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Updated At:</strong>
                    </Typography>
                    <item sx={{ fontSize: "1.1rem" }}>
                      {viewProduct.updated_at
                        ? new Date(viewProduct.updated_at).toLocaleString()
                        : "N/A"}
                    </item>
                  </Grid2>
                  <Grid2 item size={{ xs: 6 }}>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Created At:</strong>
                    </Typography>
                    <item sx={{ fontSize: "1.1rem" }}>
                      {viewProduct.created_at
                        ? new Date(viewProduct.created_at).toLocaleString()
                        : "N/A"}
                    </item>
                  </Grid2>
                </Grid2>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setViewOpen(false)}
              color="error"
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer />
      </Container>
    </>
  );
};

export default ProductComponent;
