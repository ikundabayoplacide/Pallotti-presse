import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../config';
import type { RootState } from '../../store';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  authorId: string;
  author?: { name: string; email?: string };
  category: string;
  tags: string[];
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Blog'],
  endpoints: (builder) => ({
    getBlogs: builder.query<ApiResponse<BlogPost[]>, void>({
      query: () => '/blog',
      providesTags: ['Blog'],
    }),
    getBlog: builder.query<ApiResponse<BlogPost>, string>({
      query: (id) => `/blog/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Blog', id }],
    }),
    createBlog: builder.mutation<ApiResponse<BlogPost>, FormData>({
      query: (body) => ({
        url: '/blog',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<ApiResponse<BlogPost>, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/blog/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Blog', id }, 'Blog'],
    }),
    deleteBlog: builder.mutation<ApiResponse<object>, string>({
      query: (id) => ({
        url: `/blog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
