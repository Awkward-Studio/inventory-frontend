// import api from './api';
// import { FetchProductsParams, ProductResponse } from '@/lib/types';

// export const fetchProducts = async ({
//   page = 1,
//   pageSize = 10,
//   search,
//   category,
//   ordering,
// }: FetchProductsParams): Promise<ProductResponse> => {
//   const { data } = await api.get("/products/", {
//     params: { page, page_size: pageSize, search, category, ordering },
//   });

//   console.log("API Response:", data); // Debugging
//   return data; // Paginated response
// };