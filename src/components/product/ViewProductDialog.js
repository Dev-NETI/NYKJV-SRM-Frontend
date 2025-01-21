import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  Typography,
} from "@mui/material";
import React from "react";
import Image from "next/image";

function ViewProductDialog({ viewDialog, viewProduct, closeDialog }) {
  return (
    <Dialog
      open={viewDialog}
      onClose={() => setViewOpen(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
        Product Details
      </DialogTitle>
      <DialogContent dividers>
        <Box p={2}>
          <Grid2 container spacing={2}>
            {viewProduct.image && (
              <Grid2 size={6} offset={3}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/products/${viewProduct.image}`}
                  width={200}
                  height={200}
                  alt={viewProduct.name}
                />
              </Grid2>
            )}

            <Grid2 size={{ xs: 6 }}>
              <Typography variant="body1" color="textSecondary">
                <strong>Product Name:</strong>
              </Typography>
              {viewProduct.name || "N/A"}
            </Grid2>
            <Grid2 size={{ xs: 4 }}>
              <Typography variant="body1" color="textSecondary">
                <strong>Price:</strong>
              </Typography>
              {viewProduct.price || "N/A"}
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <Typography variant="body1" color="textSecondary">
                <strong>Category:</strong>
              </Typography>
              {viewProduct.category_name || "N/A"}
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <Typography variant="body1" color="textSecondary">
                <strong>Brand:</strong>
              </Typography>
              {viewProduct.brand_name || "N/A"}
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <Typography variant="body1" color="textSecondary">
                <strong>Specification:</strong>
              </Typography>
              {viewProduct.specification || "N/A"}
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <Typography variant="body1" color="textSecondary">
                <strong>Modified By:</strong>
              </Typography>
              {viewProduct.modified_by || "N/A"}
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <Typography variant="body1" color="textSecondary">
                <strong>Updated At:</strong>
              </Typography>

              {viewProduct.updated_at
                ? new Date(viewProduct.updated_at).toLocaleString()
                : "N/A"}
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <Typography variant="body1" color="textSecondary">
                <strong>Created At:</strong>
              </Typography>

              {viewProduct.created_at
                ? new Date(viewProduct.created_at).toLocaleString()
                : "N/A"}
            </Grid2>
          </Grid2>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => closeDialog(false)}
          color="error"
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewProductDialog;
