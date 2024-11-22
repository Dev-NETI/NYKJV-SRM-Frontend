'use client';

import { useResource } from '../resource';

const useProduct = (customUrl = null) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = customUrl ? `/api/products/${customUrl}` : "/api/products";

  return {
    ...useResource({ baseURL, route }),
  };
};

export { useProduct };
