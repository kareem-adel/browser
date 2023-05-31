import { api } from '../../api';

export const publicApi = api.injectEndpoints({
  endpoints: build => ({
    getFavicon: build.query({
      query: url => 'products/1',
    }),
  }),
  overrideExisting: false,
});
export const { useGetFaviconQuery } = publicApi;
