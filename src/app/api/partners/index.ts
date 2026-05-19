import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../config';
import type { RootState } from '../../store';

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const partnersApi = createApi({
  reducerPath: 'partnersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Partner'],
  endpoints: (builder) => ({
    getPartners: builder.query<ApiResponse<Partner[]>, void>({
      query: () => '/partners',
      providesTags: ['Partner'],
    }),
    createPartner: builder.mutation<ApiResponse<Partner>, FormData>({
      query: (body) => ({
        url: '/partners',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Partner'],
    }),
    updatePartner: builder.mutation<ApiResponse<Partner>, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/partners/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Partner'],
    }),
    deletePartner: builder.mutation<ApiResponse<object>, string>({
      query: (id) => ({
        url: `/partners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Partner'],
    }),
  }),
});

export const {
  useGetPartnersQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} = partnersApi;
