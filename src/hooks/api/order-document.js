"use client";

import { useResource } from "../resource";

const useOrderDocument = (customUrl = null) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = customUrl
    ? `/api/order-document/${customUrl}`
    : "/api/order-document";
  return {
    ...useResource({ baseURL, route }),
  };
};

export { useOrderDocument };
