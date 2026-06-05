import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../config';
import type { RootState } from '../../store';

export interface AboutValue {
  title: string;
  description: string;
}

export interface AboutContent {
  id: string;
  heroTitle: string;
  heroDescription: string;
  aboutDescription: string;
  vision: string;
  mission: string;
  values: AboutValue[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAboutPayload {
  heroTitle?: string;
  heroDescription?: string;
  aboutDescription?: string;
  vision?: string;
  mission?: string;
  values?: AboutValue[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const aboutApi = createApi({
  reducerPath: 'aboutApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['About'],
  endpoints: (builder) => ({
    getAbout: builder.query<ApiResponse<AboutContent>, void>({
      query: () => '/about',
      providesTags: ['About'],
    }),
    updateAbout: builder.mutation<ApiResponse<AboutContent>, UpdateAboutPayload>({
      query: (body) => ({ url: '/about', method: 'PUT', body }),
      invalidatesTags: ['About'],
    }),
  }),
});

export const { useGetAboutQuery, useUpdateAboutMutation } = aboutApi;
