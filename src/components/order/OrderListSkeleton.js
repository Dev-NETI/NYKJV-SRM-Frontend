import React from "react";
import Skeleton from "@mui/material/Skeleton";

function OrderListSkeleton() {
  return (
    <div className="px-10">
      <Skeleton height={80} />
      <Skeleton height={80} animation="wave" />
      <Skeleton height={80} animation={false} />
      <Skeleton height={80} />
      <Skeleton height={80} animation="wave" />
      <Skeleton height={80} animation={false} />
    </div>
  );
}

export default OrderListSkeleton;
