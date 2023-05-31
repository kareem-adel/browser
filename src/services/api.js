import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.API_URL,
});
const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log({ result: JSON.stringify(result) });
  if (result.error && result.error.status === 401) {
  }
  return result;
};
export const api = createApi({
  keepUnusedDataFor: 0,
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
});
