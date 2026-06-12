import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../config';
import type { RootState } from '../../store';

export interface HeroSlide {
  id: string;
  role: 'background' | 'video' | 'slide';
  image?: string;
  video?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryLink?: string;
  secondaryLabel?: string;
  secondaryLink?: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const heroSlidesApi = createApi({
  reducerPath: 'heroSlidesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['HeroSlide'],
  endpoints: (builder) => ({
    getHeroSlides: builder.query<ApiResponse<HeroSlide[]>, void>({
      query: () => '/hero-slides',
      providesTags: ['HeroSlide'],
      keepUnusedDataFor: 600,
      transformResponse: (response: ApiResponse<HeroSlide[]>) => {
        try { localStorage.setItem('heroSlides_cache', JSON.stringify(response)); } catch {}
        return response;
      },
    }),
    getAllHeroSlides: builder.query<ApiResponse<HeroSlide[]>, void>({
      query: () => '/hero-slides/all',
      providesTags: ['HeroSlide'],
    }),
    createHeroSlide: builder.mutation<ApiResponse<HeroSlide>, FormData>({
      query: (body) => ({ url: '/hero-slides', method: 'POST', body }),
      invalidatesTags: ['HeroSlide'],
    }),
    updateHeroSlide: builder.mutation<ApiResponse<HeroSlide>, { id: string; body: FormData }>({
      query: ({ id, body }) => ({ url: `/hero-slides/${id}`, method: 'PUT', body }),
      invalidatesTags: ['HeroSlide'],
    }),
    deleteHeroSlide: builder.mutation<ApiResponse<object>, string>({
      query: (id) => ({ url: `/hero-slides/${id}`, method: 'DELETE' }),
      invalidatesTags: ['HeroSlide'],
    }),
  }),
});

export const {
  useGetHeroSlidesQuery,
  useGetAllHeroSlidesQuery,
  useCreateHeroSlideMutation,
  useUpdateHeroSlideMutation,
  useDeleteHeroSlideMutation,
} = heroSlidesApi;
