'use client';

import { useResource } from '../resource';

const useBrand = () => {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const route = '/api/brands';
    return {
        ...useResource({ baseURL, route }),
    };
};

export { useBrand };
