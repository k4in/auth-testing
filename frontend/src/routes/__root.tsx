import { createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { type RouterContext } from '../main';
import axios, { isAxiosError } from 'axios';
import { type AuthState } from '../main';
import { useAuthStore } from '../lib/authStore';
import { Login } from '../components/login';
import { MainLayout } from '../components/main-layout';

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    try {
      const response = await axios<AuthState>({
        method: 'get',
        url: 'http://localhost:3003/auth',
      });
      context.setAuth(response.data);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log('error logging in'); // in a production app i would display a toast here or something similar, for a good user experience.
        } else {
          console.log(error);
          throw new Error('Could not authenticate, unknown error');
        }
      } else {
        throw new Error('Unknown error');
      }
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const isAuthenticated = useAuthStore((state) => state.auth.is_authenticated);

  return (
    <>
      {isAuthenticated ? <MainLayout /> : <Login />}
      <TanStackRouterDevtools />
    </>
  );
}
