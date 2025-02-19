import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { useAuthStore } from './lib/authStore';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient();

export type AuthState = {
  is_authenticated: boolean;
  username?: string;
};

export interface RouterContext {
  setAuth: (auth: AuthState) => void;
  queryClient: QueryClient;
}

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient, setAuth: useAuthStore.getState().setAuth },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
