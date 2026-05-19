import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../config';
import type { RootState } from '../../store';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  client?: string;
  completedDate?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const portfolioApi = createApi({
  reducerPath: 'portfolioApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Portfolio'],
  endpoints: (builder) => ({
    getPortfolioItems: builder.query<ApiResponse<PortfolioItem[]>, void>({
      query: () => '/portfolio',
      providesTags: ['Portfolio'],
    }),
    getPortfolioItem: builder.query<ApiResponse<PortfolioItem>, string>({
      query: (id) => `/portfolio/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Portfolio', id }],
    }),
    createPortfolioItem: builder.mutation<ApiResponse<PortfolioItem>, FormData>({
      query: (body) => ({
        url: '/portfolio',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Portfolio'],
    }),
    updatePortfolioItem: builder.mutation<ApiResponse<PortfolioItem>, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/portfolio/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Portfolio', id }, 'Portfolio'],
    }),
    deletePortfolioItem: builder.mutation<ApiResponse<object>, string>({
      query: (id) => ({
        url: `/portfolio/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Portfolio'],
    }),
  }),
});

export const {
  useGetPortfolioItemsQuery,
  useGetPortfolioItemQuery,
  useCreatePortfolioItemMutation,
  useUpdatePortfolioItemMutation,
  useDeletePortfolioItemMutation,
} = portfolioApi;
