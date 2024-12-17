"use client";

import { useResource } from "../resource";

const useDepartmentSupplier = (customUrl = null) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = customUrl
    ? `/api/department-supplier/${customUrl}`
    : "/api/department-supplier";
  return {
    ...useResource({ baseURL, route }),
  };
};

export { useDepartmentSupplier };
