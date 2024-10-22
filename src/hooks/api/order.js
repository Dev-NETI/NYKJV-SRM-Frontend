"use client";

import { useResource } from "../resource";

const useOrder = (customUrl = null) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = customUrl ? `/api/order/${customUrl}` : "/api/order";
  return {
    ...useResource({ baseURL, route }),
  };
};

export { useOrder };
