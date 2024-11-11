"use client";

import { useResource } from "../resource";

const useCompanies = () => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = "/api/companies";
  return {
    ...useResource({ baseURL, route }),
  };
};

export { useCompanies };
