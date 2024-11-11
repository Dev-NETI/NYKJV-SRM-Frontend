"use client";

import { useResource } from "../resource";

const useRolesUser = (customRoute = null) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = customRoute ? `/api/${customRoute}` : "/api/roles-user";

  return {
    ...useResource({ baseURL, route }),
  };
};

export { useRolesUser };
