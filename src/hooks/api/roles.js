"use client";

import { useResource } from "../resource";

const useRoles = (customRoute = null) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = customRoute ? `/api/${customRoute}` : "/api/roles";

  return {
    ...useResource({ baseURL, route }),
  };
};

export { useRoles };
