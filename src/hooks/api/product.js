"use client";

import { useResource } from "../resource";

const useProduct = () => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = "/api/products";

  return {
    ...useResource({ baseURL, route }),
  };
};

// const useProducts = () => useAPIResource('/api/products');
// const useCategory = () => useAPIResource('/api/category');
// const useBrand = () => useAPIResource('/api/category');

export { useProduct };
