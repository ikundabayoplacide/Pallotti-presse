import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../config';
import type { RootState } from '../../store';

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessagePayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Message'],
  endpoints: (builder) => ({
    getMessages: builder.query<ApiResponse<Message[]>, void>({
      query: () => '/messages',
      providesTags: ['Message'],
    }),
    getMessage: builder.query<ApiResponse<Message>, string>({
      query: (id) => `/messages/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Message', id }],
    }),
    createMessage: builder.mutation<ApiResponse<Message>, CreateMessagePayload>({
      query: (body) => ({
        url: '/messages',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Message'],
    }),
    markAsRead: builder.mutation<ApiResponse<Message>, string>({
      query: (id) => ({
        url: `/messages/${id}`,
        method: 'PUT',
        body: { read: true },
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Message', id }, 'Message'],
    }),
    deleteMessage: builder.mutation<ApiResponse<object>, string>({
      query: (id) => ({
        url: `/messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Message'],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useGetMessageQuery,
  useCreateMessageMutation,
  useMarkAsReadMutation,
  useDeleteMessageMutation,
} = messagesApi;
