import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../config';
import type { RootState } from '../../store';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super-admin';
  createdAt: string;
}

interface ApiResponse<T> { success: boolean; data: T; }

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<ApiResponse<AdminUser[]>, void>({
      query: () => '/auth/users',
      providesTags: ['User'],
    }),
    createUser: builder.mutation<ApiResponse<AdminUser>, { name: string; email: string; password: string; role: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<ApiResponse<AdminUser>, { id: string; body: Partial<{ name: string; email: string; role: string; password: string }> }>({
      query: ({ id, body }) => ({ url: `/auth/users/${id}`, method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<ApiResponse<object>, string>({
      query: (id) => ({ url: `/auth/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } = usersApi;
