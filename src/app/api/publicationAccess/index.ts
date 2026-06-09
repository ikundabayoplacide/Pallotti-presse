import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../config';
import type { RootState } from '../../store';
import type { Publication } from '../publications';

export interface PublicationAccessRequest {
  id: string;
  publicationId: string;
  email: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  accessToken?: string;
  accessTokenExpiresAt?: string;
  createdAt: string;
  publication?: { id: string; title: string };
}

interface ApiResponse<T> { success: boolean; data: T; token?: string; }

export const publicationAccessApi = createApi({
  reducerPath: 'publicationAccessApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['PublicationAccess'],
  endpoints: (builder) => ({
    getAllRequests: builder.query<ApiResponse<PublicationAccessRequest[]>, void>({
      query: () => '/publication-access',
      providesTags: ['PublicationAccess'],
    }),
    requestAccess: builder.mutation<ApiResponse<PublicationAccessRequest>, { publicationId: string; email: string; transactionId: string }>({
      query: (body) => ({ url: '/publication-access/request', method: 'POST', body }),
      invalidatesTags: ['PublicationAccess'],
    }),
    grantAccess: builder.mutation<ApiResponse<PublicationAccessRequest>, string>({
      query: (id) => ({ url: `/publication-access/${id}/grant`, method: 'PUT' }),
      invalidatesTags: ['PublicationAccess'],
    }),
    rejectAccess: builder.mutation<ApiResponse<PublicationAccessRequest>, string>({
      query: (id) => ({ url: `/publication-access/${id}/reject`, method: 'PUT' }),
      invalidatesTags: ['PublicationAccess'],
    }),
    verifyAccess: builder.query<ApiResponse<Publication>, { token: string; publicationId: string }>({
      query: ({ token, publicationId }) => `/publication-access/verify?token=${token}&publicationId=${publicationId}`,
    }),
    deleteRequest: builder.mutation<ApiResponse<object>, string>({
      query: (id) => ({ url: `/publication-access/${id}`, method: 'DELETE' }),
      invalidatesTags: ['PublicationAccess'],
    }),
  }),
});

export const {
  useGetAllRequestsQuery,
  useRequestAccessMutation,
  useGrantAccessMutation,
  useRejectAccessMutation,
  useVerifyAccessQuery,
  useDeleteRequestMutation,
} = publicationAccessApi;
