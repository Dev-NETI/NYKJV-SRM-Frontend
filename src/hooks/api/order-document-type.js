"use client";

import { useResource } from "../resource";

const useOrderDocumentType = (customUrl = null) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = customUrl
    ? `/api/order-document-type/${customUrl}`
    : "/api/order-document-type";
  return {
    ...useResource({ baseURL, route }),
  };
};

export { useOrderDocumentType };
