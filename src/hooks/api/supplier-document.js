"use client";

import { useResource } from "../resource";

const useSupplierDocument = (customUrl = null) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = customUrl
    ? `/api/supplier-document/${customUrl}`
    : "/api/supplier-document";
  return {
    ...useResource({ baseURL, route }),
  };
};

export { useSupplierDocument };
