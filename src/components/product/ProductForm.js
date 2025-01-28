"use client";
import React, { useEffect, useState } from "react";
import { CloudUploadIcon } from "lucide-react";
import {
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  Typography,
  DialogActions,
} from "@mui/material";
import Item from "../material-ui/Item";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "@/lib/axios";
import { currency } from "../../data/products";
import { useAuth } from "@/hooks/auth";
import { useProduct } from "@/hooks/api/product";
import Image from "next/image";

function ProductForm({
  isOpen,
  closeForm,
  brandItems,
  categoryItems,
  selectedProduct = null,
  setSelectedProduct,
  setReloadListState,
}) {
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [priceVatEx, setPriceVatEx] = useState(0);
  const { user } = useAuth({ middleware: "auth" });
  const { show } = useProduct();
  const [retrievedProduct, setRetrievedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: selectedProductData } = await show(selectedProduct);
      setRetrievedProduct(selectedProductData);
      setPriceVatEx(selectedProductData.price_vat_ex || 0);
    };
    if (selectedProduct) {
      fetchData();
    }
  }, [selectedProduct]);

  // selectedProduct && console.log(selectedProduct);

  const handleClose = () => {
    closeForm(false);
    setSelectedProduct(null);
    setRetrievedProduct(null);
    setPriceVatEx(0);
    resetForm();
  };

  const resetForm = () => {
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const object = Object.fromEntries(formData.entries());
    object.fileImage = file;
    object.supplierId = user?.supplier_id;

    const validationErrors = validateForm(object);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!selectedProduct) {
      const { data: apiResponse } = await axios.post("api/products", object, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      apiResponse.response
        ? (toast.success(apiResponse.message),
          setReloadListState(Math.random()))
        : toast.error(apiResponse.message);
    } else {
      object.productId = selectedProduct;
      const { data: apiResponse } = await axios.post(
        "api/products/update-product",
        object,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      apiResponse.response
        ? (toast.success(apiResponse.message),
          setReloadListState(Math.random()))
        : toast.error(apiResponse.message);
    }

    handleClose();
  };

  const validateForm = (object) => {
    const errors = {};

    if (!object.productName?.trim()) {
      errors.productName = "Product Name is required.";
    }

    // Validate productPrice
    if (object.productPrice != null && object.productPrice !== 0) {
      if (isNaN(object.productPrice)) {
        errors.productPrice = "Product Price must be a valid number.";
      } else if (Number(object.productPrice) < 0) {
        errors.productPrice = "Product Price cannot be negative.";
      }
    }

    // Validate productPriceVatEx
    if (object.productPriceVatEx != null && object.productPriceVatEx !== 0) {
      if (isNaN(object.productPriceVatEx)) {
        errors.productPriceVatEx =
          "Product Price (VAT Excluded) must be a valid number.";
      } else if (Number(object.productPriceVatEx) < 0) {
        errors.productPriceVatEx =
          "Product Price (VAT Excluded) cannot be negative.";
      }
    }

    if (!object.productSpecification?.trim()) {
      errors.productSpecification = "Product Specification is required.";
    }

    if (!object.productCategory) {
      errors.productCategory = "Please select a category.";
    }

    if (!object.productBrand) {
      errors.productBrand = "Please select a brand.";
    }

    if (!object.currencyId) {
      errors.currencyId = "Please select a currency.";
    }

    return errors;
  };

  const handlePriceChange = (event) => {
    const priceWithoutVat = (event.target.value / 1.12).toFixed(2);
    setPriceVatEx(priceWithoutVat);
  };

  const form = (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {!selectedProduct ? "Add Product" : "Edit Product"}
      </DialogTitle>
      <DialogContent>
        <Box>
          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={2}>
              {retrievedProduct?.image_path && (
                <Grid2 size={6} offset={3}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/products/${retrievedProduct?.image_path}`}
                    width={200}
                    height={200}
                    alt={retrievedProduct?.name}
                  />
                </Grid2>
              )}

              <Grid2 size={12}>
                <Typography variant="body1" color="textSecondary">
                  <strong>
                    Product Name:<text className="text-red-600">*</text>
                  </strong>
                </Typography>
                <Item>
                  <input
                    defaultValue={retrievedProduct?.name || ""}
                    type="text"
                    id="productName"
                    name="productName"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </Item>
                {errors.productName && (
                  <p className="text-red-500 text-sm">{errors.productName}</p>
                )}
              </Grid2>
              <Grid2 size={12}>
                <Typography variant="body1" color="textSecondary">
                  <strong>Select Product Image:</strong>
                  <small className="text-red-600 text-xs">(optional)</small>
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    onChange={(event) => {
                      const file = event.target.files[0];
                      setFile(file);
                    }}
                  />
                </Button>
                {errors.fileImage && (
                  <p className="text-red-500 text-sm">{errors.fileImage}</p>
                )}
              </Grid2>
              <Grid2 size={{ xs: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  <strong>Currency:</strong>
                </Typography>
                <Item>
                  <select
                    defaultValue={retrievedProduct?.price || ""}
                    id="currencyId"
                    name="currencyId"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {currency.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </Item>
                {errors.currency && (
                  <p className="text-red-500 text-sm">{errors.currency}</p>
                )}
              </Grid2>
              <Grid2 size={4}>
                <Typography variant="body1" color="textSecondary">
                  <strong>Price w/ Vat:</strong>
                  <small className="text-red-600 text-xs">(optional)</small>
                </Typography>
                <Item>
                  <input
                    defaultValue={retrievedProduct?.price || 0}
                    type="text"
                    id="productPrice"
                    name="productPrice"
                    onChange={(event) => handlePriceChange(event)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </Item>
                {errors.productPrice && (
                  <p className="text-red-500 text-sm">{errors.productPrice}</p>
                )}
              </Grid2>
              <Grid2 size={4}>
                <Typography variant="body1" color="textSecondary">
                  <strong>Price w/o Vat:</strong>
                  <small className="text-red-600 text-xs">(optional)</small>
                </Typography>
                <Item>
                  <input
                    value={priceVatEx}
                    readOnly
                    id="productPriceVatEx"
                    name="productPriceVatEx"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </Item>
                {errors.productPriceVatEx && (
                  <p className="text-red-500 text-sm">
                    {errors.productPriceVatEx}
                  </p>
                )}
              </Grid2>
              
              <Grid2 size={{ xs: 6 }}>
                <Typography variant="body1" color="textSecondary">
                  <strong>
                    Brand:<text className="text-red-600">*</text>
                  </strong>
                </Typography>
                <Item>
                  <select
                    id="productBrand"
                    name="productBrand"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={retrievedProduct?.brand_id || ""}
                  >
                    <option value="">Select a brand</option>
                    {Array.isArray(brandItems) && brandItems.length > 0 ? (
                      brandItems.map(({ id, name }) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No Brand available
                      </option>
                    )}
                  </select>
                </Item>
                {errors.productBrand && (
                  <p className="text-red-500 text-sm">{errors.productBrand}</p>
                )}
              </Grid2>

              <Grid2 size={{ xs: 6 }}>
                <Typography variant="body1" color="textSecondary">
                  <strong>
                    Category:<text className="text-red-600">*</text>
                  </strong>
                </Typography>
                <Item>
                  <select
                    id="productCategory"
                    name="productCategory"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={retrievedProduct?.category_id || ""}
                  >
                    <option value="">Select a category</option>
                    {Array.isArray(categoryItems) && categoryItems.length > 0 ? (
                      categoryItems.map(({ id, name }) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No categories available
                      </option>
                    )}
                  </select>
                </Item>
                {errors.productCategory && (
                  <p className="text-red-500 text-sm">{errors.productCategory}</p>
                )}
              </Grid2>


              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body1" color="textSecondary">
                  <strong>
                    Specification:<text className="text-red-600">*</text>
                  </strong>
                </Typography>
                <Item>
                  <textarea
                    id="productSpecification"
                    name="productSpecification"
                    defaultValue={retrievedProduct?.specification}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </Item>
                {errors.productSpecification && (
                  <p className="text-red-500 text-sm">
                    {errors.productSpecification}
                  </p>
                )}
              </Grid2>
            </Grid2>
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
                  {!selectedProduct ? "Add Product" : "Update Product"}
                </Button>
              </DialogActions>
            </div>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );

  let ui;
  if (!selectedProduct) {
    ui = form;
  } else {
    ui = !retrievedProduct ? <p></p> : form;
  }

  return ui;
}

export default ProductForm;
