"use client";

import { useResource } from "../resource";

const useDepartment = (customUrl = null) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = customUrl ? `/api/department/${customUrl}` : "/api/department";
  return {
    ...useResource({ baseURL, route }),
  };
};

export { useDepartment };
