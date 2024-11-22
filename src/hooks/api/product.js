'use client';

import { useResource } from '../resource';

const useAPIResource = (route) => {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    return {
        ...useResource({ baseURL, route }),
    };
};

const useProducts = () => useAPIResource('/api/products');
const useCategory = () => useAPIResource('/api/category');
const useBrand = () => useAPIResource('/api/category');

export { useProducts, useCategory, useBrand };
