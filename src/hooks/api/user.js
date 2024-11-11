"use client";

import { useResource } from "../resource";

const useUser = (customRoute = null) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = customRoute
    ? `/api/users-management/${customRoute}`
    : "/api/users-management";

  return {
    ...useResource({ baseURL, route }),
  };
};

export { useUser };
