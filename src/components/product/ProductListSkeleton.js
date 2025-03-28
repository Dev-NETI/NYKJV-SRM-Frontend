import { Skeleton } from "@mui/material";
import React from "react";

function ProductListSkeleton() {
  return (
    <div className="flex flex-col gap-10  mt-16 mx-24">
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
    </div>
  );
}

export default ProductListSkeleton;
