import { configureStore } from '@reduxjs/toolkit';
import { aboutApi } from './api/about';
import { authApi } from './api/auth';
import { blogApi } from './api/blog';
import { faqsApi } from './api/faqs';
import { galleryApi } from './api/gallery';
import { heroSlidesApi } from './api/heroSlides';
import { publicationAccessApi } from './api/publicationAccess';
import { messagesApi } from './api/messages';
import { partnersApi } from './api/partners';
import { portfolioApi } from './api/portfolio';
import { publicationsApi } from './api/publications';
import { servicesApi } from './api/services';
import { testimonialsApi } from './api/testimonials';
import { usersApi } from './api/users';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [aboutApi.reducerPath]: aboutApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [portfolioApi.reducerPath]: portfolioApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [partnersApi.reducerPath]: partnersApi.reducer,
    [testimonialsApi.reducerPath]: testimonialsApi.reducer,
    [faqsApi.reducerPath]: faqsApi.reducer,
    [publicationsApi.reducerPath]: publicationsApi.reducer,
    [heroSlidesApi.reducerPath]: heroSlidesApi.reducer,
    [publicationAccessApi.reducerPath]: publicationAccessApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      aboutApi.middleware,
      galleryApi.middleware,
      servicesApi.middleware,
      portfolioApi.middleware,
      blogApi.middleware,
      messagesApi.middleware,
      partnersApi.middleware,
      testimonialsApi.middleware,
      faqsApi.middleware,
      publicationsApi.middleware,
      heroSlidesApi.middleware,
      publicationAccessApi.middleware,
      usersApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
