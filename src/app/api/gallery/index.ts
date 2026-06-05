import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../config';
import type { RootState } from '../../store';

export interface GalleryImage {
  id: string;
  title?: string;
  image: string;
  category: string;
  featured: boolean;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const galleryApi = createApi({
  reducerPath: 'galleryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Gallery'],
  endpoints: (builder) => ({
    getImages: builder.query<ApiResponse<GalleryImage[]>, void>({
      query: () => '/gallery',
      providesTags: ['Gallery'],
    }),
    getAllImages: builder.query<ApiResponse<GalleryImage[]>, void>({
      query: () => '/gallery/all',
      providesTags: ['Gallery'],
    }),
    createImage: builder.mutation<ApiResponse<GalleryImage>, FormData>({
      query: (body) => ({ url: '/gallery', method: 'POST', body }),
      invalidatesTags: ['Gallery'],
    }),
    updateImage: builder.mutation<ApiResponse<GalleryImage>, { id: string; body: FormData }>({
      query: ({ id, body }) => ({ url: `/gallery/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Gallery'],
    }),
    deleteImage: builder.mutation<ApiResponse<object>, string>({
      query: (id) => ({ url: `/gallery/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Gallery'],
    }),
  }),
});

export const {
  useGetImagesQuery,
  useGetAllImagesQuery,
  useCreateImageMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
} = galleryApi;
