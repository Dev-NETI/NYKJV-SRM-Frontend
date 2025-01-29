import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

function DepartmentListSkeleton() {
  return (
    <Stack spacing={2}>
      <Skeleton variant="rectangular" height={60} animation="wave" />
      <Skeleton variant="rectangular" height={60} animation="wave" />
      <Skeleton variant="rectangular" height={60} animation="wave" />
      <Skeleton variant="rectangular" height={60} animation="wave" />
      <Skeleton variant="rectangular" height={60} animation="wave" />
      <Skeleton variant="rectangular" height={60} animation="wave" />
    </Stack>
  );
}

export default DepartmentListSkeleton;
