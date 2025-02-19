import { createRootRouteWithContext, Link, Outlet, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { type RouterContext } from '../main';
import LogoutButton from '../components/logout-button';
import axios, { isAxiosError } from 'axios';
import { type AuthState } from '../main';
import { useAuthStore } from '../lib/authStore';

const publicRoutes = ['/login', '/logout'];

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ location, context }) => {
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
          console.log('redirecting to login'); // in a production app i would display a toast here or something similar, for a good user experience.
          throw redirect({ to: '/login', search: { redirect: location.href } });
        } else {
          console.log(error);
          throw new Error('Could not authenticate');
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
      <header className="p-2 flex gap-2 border-b items-center">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/countries" className="[&.active]:font-bold">
          Countries
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        {!isAuthenticated && (
          <Link to="/login" className="[&.active]:font-bold ml-auto">
            Login
          </Link>
        )}
        {isAuthenticated && <LogoutButton />}
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
