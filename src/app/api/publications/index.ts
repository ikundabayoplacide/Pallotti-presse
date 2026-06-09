import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../config';
import type { RootState } from '../../store';

export interface Publication {
  id: string;
  title: string;
  content?: string;
  fileContent?: string;
  fileType?: string;
  fileName?: string;
  coverImage?: string;
  category: string;
  published: boolean;
  featured: boolean;
  isPremium: boolean;
  price?: string;
  momoNumber?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const publicationsApi = createApi({
  reducerPath: 'publicationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Publication'],
  endpoints: (builder) => ({
    getPublications: builder.query<ApiResponse<Publication[]>, void>({
      query: () => '/publications',
      providesTags: ['Publication'],
    }),
    getAllPublications: builder.query<ApiResponse<Publication[]>, void>({
      query: () => '/publications/all',
      providesTags: ['Publication'],
    }),
    getPublication: builder.query<ApiResponse<Publication>, string>({
      query: (id) => `/publications/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Publication', id }],
      keepUnusedDataFor: 3600,
    }),
    createPublication: builder.mutation<ApiResponse<Publication>, FormData>({
      query: (body) => ({
        url: '/publications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Publication'],
    }),
    updatePublication: builder.mutation<ApiResponse<Publication>, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/publications/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Publication', id }, 'Publication'],
    }),
    deletePublication: builder.mutation<ApiResponse<object>, string>({
      query: (id) => ({
        url: `/publications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Publication'],
    }),
  }),
});

export const {
  useGetPublicationsQuery,
  useGetAllPublicationsQuery,
  useGetPublicationQuery,
  useCreatePublicationMutation,
  useUpdatePublicationMutation,
  useDeletePublicationMutation,
} = publicationsApi;
