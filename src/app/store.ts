import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/auth';
import { blogApi } from './api/blog';
import { faqsApi } from './api/faqs';
import { messagesApi } from './api/messages';
import { partnersApi } from './api/partners';
import { portfolioApi } from './api/portfolio';
import { servicesApi } from './api/services';
import { testimonialsApi } from './api/testimonials';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [portfolioApi.reducerPath]: portfolioApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [partnersApi.reducerPath]: partnersApi.reducer,
    [testimonialsApi.reducerPath]: testimonialsApi.reducer,
    [faqsApi.reducerPath]: faqsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      servicesApi.middleware,
      portfolioApi.middleware,
      blogApi.middleware,
      messagesApi.middleware,
      partnersApi.middleware,
      testimonialsApi.middleware,
      faqsApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
