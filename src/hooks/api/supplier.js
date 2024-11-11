"use client";

import { useResource } from "../resource";

const useSupplier = () => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = "/api/supplier";
  return {
    ...useResource({ baseURL, route }),
  };
};

export { useSupplier };
