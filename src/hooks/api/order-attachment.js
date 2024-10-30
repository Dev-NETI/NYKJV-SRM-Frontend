"use client";

import { useResource } from "../resource";

const useOrderAttachment = (customUrl = null) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = customUrl
    ? `/api/order-attachment/${customUrl}`
    : "/api/order-attachment";
  return {
    ...useResource({ baseURL, route }),
  };
};

export { useOrderAttachment };
