"use client";

import { useResource } from "../resource";

const useDocumentType = () => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = "/api/document-type";

  return {
    ...useResource({ baseURL, route }),
  };
};

export { useDocumentType };
