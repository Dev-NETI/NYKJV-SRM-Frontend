import React from "react";
import Skeleton from "@mui/material/Skeleton";

function OrderListSkeletonComponent() {
  return (
    <div>
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
    </div>
  );
}

export default OrderListSkeletonComponent;
