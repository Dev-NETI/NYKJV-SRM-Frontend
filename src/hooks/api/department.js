"use client";

import { useResource } from "../resource";

const useDepartment = () => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = "/api/department";
  return {
    ...useResource({ baseURL, route }),
  };
};

export { useDepartment };
