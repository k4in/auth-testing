import { createRootRouteWithContext, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { type RouterContext } from '../main';
import axios, { isAxiosError } from 'axios';
import { type AuthState } from '../main';
import { MainLayout } from '../components/main-layout';

const publicRoutes = ['/login'];

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context, location }) => {
    if (publicRoutes.includes(location.pathname)) return;

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
          console.log('not authenticated'); // in a production app i would display a toast here or something similar, for a good user experience.
          context.clearAuth();
          throw redirect({
            to: '/login',
            search: { redirect: location.href },
          });
        } else {
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
  return (
    <>
      <MainLayout />
      <TanStackRouterDevtools />
    </>
  );
}
