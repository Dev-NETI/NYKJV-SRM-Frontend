"use client";

import { useResource } from "../resource";

const useProduct = () => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = "/api/products";

  return {
    ...useResource({ baseURL, route }),
  };
};

export { useProduct };
