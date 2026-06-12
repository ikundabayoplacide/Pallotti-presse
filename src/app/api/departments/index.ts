import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../config';
import type { RootState } from '../../store';

export interface Department {
  id: string;
  name: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const departmentsApi = createApi({
  reducerPath: 'departmentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Department'],
  endpoints: (builder) => ({
    getDepartments: builder.query<ApiResponse<Department[]>, void>({
      query: () => '/departments',
      providesTags: ['Department'],
    }),
    createDepartment: builder.mutation<ApiResponse<Department>, FormData>({
      query: (body) => ({ url: '/departments', method: 'POST', body }),
      invalidatesTags: ['Department'],
    }),
    updateDepartment: builder.mutation<ApiResponse<Department>, { id: string; body: FormData }>({
      query: ({ id, body }) => ({ url: `/departments/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Department'],
    }),
    deleteDepartment: builder.mutation<ApiResponse<object>, string>({
      query: (id) => ({ url: `/departments/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Department'],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApi;
