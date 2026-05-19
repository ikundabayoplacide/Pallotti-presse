import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../config';
import type { RootState } from '../../store';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQPayload {
  question: string;
  answer: string;
  order?: number;
  published?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const faqsApi = createApi({
  reducerPath: 'faqsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['FAQ'],
  endpoints: (builder) => ({
    getFAQs: builder.query<ApiResponse<FAQ[]>, void>({
      query: () => '/faqs',
      providesTags: ['FAQ'],
    }),
    getAllFAQs: builder.query<ApiResponse<FAQ[]>, void>({
      query: () => '/faqs/all',
      providesTags: ['FAQ'],
    }),
    createFAQ: builder.mutation<ApiResponse<FAQ>, FAQPayload>({
      query: (body) => ({ url: '/faqs', method: 'POST', body }),
      invalidatesTags: ['FAQ'],
    }),
    updateFAQ: builder.mutation<ApiResponse<FAQ>, { id: string; body: FAQPayload }>({
      query: ({ id, body }) => ({ url: `/faqs/${id}`, method: 'PUT', body }),
      invalidatesTags: ['FAQ'],
    }),
    deleteFAQ: builder.mutation<ApiResponse<object>, string>({
      query: (id) => ({ url: `/faqs/${id}`, method: 'DELETE' }),
      invalidatesTags: ['FAQ'],
    }),
  }),
});

export const {
  useGetFAQsQuery,
  useGetAllFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} = faqsApi;
