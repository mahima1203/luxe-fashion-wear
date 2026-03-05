'use server';

import { searchProducts } from './products';

export async function getSearchResults(query: string) {
    return await searchProducts(query);
}
