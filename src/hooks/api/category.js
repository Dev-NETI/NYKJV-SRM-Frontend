'use client';

import { useResource } from '../resource';

const useCategory = () => {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const route = '/api/category';
    return {
        ...useResource({ baseURL, route }),
    };
};

export { useCategory };