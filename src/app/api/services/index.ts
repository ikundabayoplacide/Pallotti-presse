import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../config';
import type { RootState } from '../../store';

export interface Service {
  id: string;
  name: string;
  description: string;
  price?: string;
  image: string;
  category: 'printing' | 'design' | 'packaging' | 'marketing';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServicePayload {
  name: string;
  description: string;
  price?: string;  // optional
  image?: string;
  category: Service['category'];
  featured?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const servicesApi = createApi({
  reducerPath: 'servicesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Service'],
  endpoints: (builder) => ({
    getServices: builder.query<ApiResponse<Service[]>, void>({
      query: () => '/services',
      providesTags: ['Service'],
      keepUnusedDataFor: 300,
    }),
    getService: builder.query<ApiResponse<Service>, string>({
      query: (id) => `/services/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Service', id }],
    }),
    createService: builder.mutation<ApiResponse<Service>, FormData>({
      query: (body) => ({
        url: '/services',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Service'],
    }),
    updateService: builder.mutation<ApiResponse<Service>, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/services/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Service', id }, 'Service'],
    }),
    deleteService: builder.mutation<ApiResponse<object>, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service'],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;
