import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../config';
import type { RootState } from '../../store';

export interface Testimonial {
  id: string;
  clientName: string;
  clientPosition?: string;
  clientCompany?: string;
  clientImage?: string;
  testimonial: string;
  rating: number;
  featured: boolean;
  approved: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const testimonialsApi = createApi({
  reducerPath: 'testimonialsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Testimonial'],
  endpoints: (builder) => ({
    getTestimonials: builder.query<ApiResponse<Testimonial[]>, void>({
      query: () => '/testimonials',
      providesTags: ['Testimonial'],
    }),
    getAllTestimonials: builder.query<ApiResponse<Testimonial[]>, void>({
      query: () => '/testimonials/all',
      providesTags: ['Testimonial'],
    }),
    createTestimonial: builder.mutation<ApiResponse<Testimonial>, FormData>({
      query: (body) => ({
        url: '/testimonials',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Testimonial'],
    }),
    updateTestimonial: builder.mutation<ApiResponse<Testimonial>, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/testimonials/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Testimonial'],
    }),
    approveTestimonial: builder.mutation<ApiResponse<Testimonial>, string>({
      query: (id) => ({
        url: `/testimonials/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: ['Testimonial'],
    }),
    deleteTestimonial: builder.mutation<ApiResponse<object>, string>({
      query: (id) => ({
        url: `/testimonials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Testimonial'],
    }),
  }),
});

export const {
  useGetTestimonialsQuery,
  useGetAllTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useApproveTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialsApi;
