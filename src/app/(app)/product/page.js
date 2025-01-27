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
  IconButton,
  TextField,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Search as SearchIcon } from "@mui/icons-material"; // Change to MUI's Search Icon
import { useAuth } from "@/hooks/auth";
import ProductForm from "@/components/product/ProductForm";
import ViewProductDialog from "@/components/product/ViewProductDialog";
import ProductListSkeleton from "@/components/product/ProductListSkeleton";
import Image from "next/image";

const ProductComponent = () => {
  const { destroy: deactivateProduct } = useProduct();
  const { show: showProduct } = useProduct("get-products");

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [deactivatingId, setDeactivatingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { index: showBrand } = useBrand();
  const [brandItems, setBrand] = useState([]);
  const { index: showCategory } = useCategory();
  const [categoryItems, setCategory] = useState([]);
  const { user } = useAuth({ middleware: "auth" });
  const [reloadListState, setReloadListState] = useState(0);
  const [loading, setLoading] = useState({
    adding: false,
    updating: false,
    deactivating: false,
    getProduct: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: brandData } = await showBrand();
        const { data: categoryData } = await showCategory();
        const { data: productData } = await showProduct(
          user?.supplier_id || "null"
        );
        setBrand(brandData);
        setCategory(categoryData);
        setProducts(productData);
        setFilteredProducts(productData);
        setLoading((prevState) => ({ ...prevState, getProduct: false }));
      } catch (error) {
        toast.error("Failed to load data. Please try again later.");
      }
    };
    if (
      brandItems.length === 0 &&
      categoryItems.length === 0 &&
      products.length === 0
    ) {
      fetchData();
    }

    // Fetch data when reloadListState changes
    if (reloadListState) {
      fetchData();
    }
  }, [
    brandItems,
    categoryItems,
    products,
    showBrand,
    showCategory,
    showProduct,
    reloadListState,
  ]);

  useEffect(() => {
    const lowerCaseSearch = search.toLowerCase();
    const result = products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseSearch) ||
        product.category.name.toLowerCase().includes(lowerCaseSearch) ||
        product.brand.name.toLowerCase().includes(lowerCaseSearch)
    );
    setFilteredProducts(result);
  }, [search, products]);

  const columns = [
    { field: "id", headerName: "#", width: 50 },
    {
      field: "image_path",
      headerName: "Image",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        const imagePath = params.row.image_path;
        if (!imagePath) {
          // Return nothing if image_path is null or empty
          return null;
        }

        return (
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/products/${imagePath}`}
            width={75}
            height={75}
            alt={params.row.name || "Product Image"}
            style={{ objectFit: "contain" }}
          />
        );
      },
    },
    { field: "name", headerName: "Product", flex: 1, minWidth: 180 },
    { field: "category_name", headerName: "Category", width: 200 },
    { field: "brand_name", headerName: "Brand", width: 200 },
    { field: "price", headerName: "Price w/ vat", width: 100 },
    { field: "price_vat_ex", headerName: "Price w/0 vat", width: 100 },
    {
      field: "specification",
      headerName: "Specification",
      width: 250,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          {user?.supplier_id && (
            <IconButton
              aria-label="edit"
              color="primary"
              size="small"
              onClick={() => handleEdit(params.row)}
            >
              <EditIcon />
            </IconButton>
          )}
          <IconButton
            aria-label="view"
            color="info"
            size="small"
            onClick={() => handleView(params.row)}
            sx={{ ml: 1 }}
          >
            <VisibilityIcon />
          </IconButton>
          {user?.supplier_id && (
            <IconButton
              aria-label="deactivate"
              color="error"
              size="small"
              onClick={() => handleDeactivate(params.row.id)}
              sx={{ ml: 1 }}
              disabled={deactivatingId === params.row.id}
            >
              {deactivatingId === params.row.id ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <DeleteIcon />
              )}
            </IconButton>
          )}
        </>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  const currency = (currency_id) => {
    return currency_id === 0 ? "₱" : "$";
  };

  const rows = filteredProducts.map((product) => ({
    id: product.id,
    category_name: product.category.name,
    brand_name: product.brand.name,
    category_id: product.category_id,
    brand_id: product.brand_id,
    image_path: product.image_path,
    name: product.name,
    price:
      product.price != null && product.price > 0
        ? `${currency(product.currency_id)} ${product.price}`
        : "",
    price_vat_ex:
      product.price_vat_ex != null && product.price_vat_ex > 0
        ? `${currency(product.currency_id)} ${product.price_vat_ex}`
        : "",
    specification: product.specification,
    image: product.image_path,
  }));

  const handleOpen = () => setOpen(true);

  const handleEdit = (product) => {
    setOpen(true);
    setSelectedProduct(product.id);
  };

  const handleDeactivate = async (id) => {
    setLoading((prev) => ({ ...prev, deactivating: true }));
    try {
      await deactivateProduct(id);
      setProducts(products.filter((product) => product.id !== id));
      setFilteredProducts(
        filteredProducts.filter((product) => product.id !== id)
      );
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
      setReloadListState(Math.random());
      toast.success("Product deactivated successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to deactivate product. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, deactivating: false }));
    }
  };

  const handleMultipleDeactivate = async () => {
    setLoading((prev) => ({ ...prev, deactivating: true }));
    try {
      await Promise.all(selectedIds.map((id) => deactivateProduct(id)));
      setProducts(
        products.filter((product) => !selectedIds.includes(product.id))
      );
      setFilteredProducts(
        filteredProducts.filter((product) => !selectedIds.includes(product.id))
      );
      setSelectedIds([]);
      setReloadListState(Math.random());
      toast.success("Selected products deactivated successfully!");
    } catch (error) {
      console.error("Error deactivating products:", error);
      toast.error("Failed to deactivate products. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, deactivating: false }));
    }
  };

  const handleView = (product) => {
    setViewProduct(product);
    setViewOpen(true);
  };

  return (
    <>
      <Header title="Product" />

      {loading.getProduct ? (
        <ProductListSkeleton />
      ) : (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
          <Box display="flex" justifyContent="center">
            <Paper sx={{ width: "100%", p: 2 }}>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Box display="flex" alignItems="center">
                  <TextField
                    variant="outlined"
                    placeholder="Search Products"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mr: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box display="flex" alignItems="center">
                  {/* add product button */}
                  {user?.supplier_id && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpen}
                      disabled={loading.adding || loading.updating} // Disable during loading
                    >
                      {loading.adding || loading.updating ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Add"
                      )}
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleMultipleDeactivate}
                    disabled={selectedIds.length === 0 || loading.deactivating} // Disable if no products selected or during loading
                    sx={{ ml: 2 }}
                  >
                    {loading.deactivating ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Deactivate"
                    )}
                  </Button>
                </Box>
              </Box>
              <Box sx={{ p: 2 }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pagination
                  initialState={{
                    pagination: { paginationModel },
                  }}
                  pageSizeOptions={[5, 10, 20, 30, 40, 50]}
                  checkboxSelection
                  disableRowSelectionOnClick // This disables row selection when clicking anywhere else
                  onRowSelectionModelChange={(ids) => {
                    setSelectedIds(ids);
                  }} // Track selected rows
                  sx={{ border: 0 }}
                />
              </Box>
            </Paper>
          </Box>
        </Container>
      )}

      <ProductForm
        isOpen={open}
        closeForm={setOpen}
        brandItems={brandItems}
        categoryItems={categoryItems}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        setReloadListState={setReloadListState}
      />
      <ViewProductDialog
        viewDialog={viewOpen}
        viewProduct={viewProduct}
        closeDialog={setViewOpen}
      />
      <ToastContainer />
    </>
  );
};

export default ProductComponent;
