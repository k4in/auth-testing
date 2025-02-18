import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { type RouterContext } from '../main';
import { getAuthInfo } from '../lib/utils/getAuthInfo';

const publicRoutes = ['/login', '/logout'];

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ location }) => {
    if (publicRoutes.includes(location.pathname)) return;
    await getAuthInfo(location.href);
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <header className="p-2 flex gap-2 border-b">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/countries" className="[&.active]:font-bold">
          Countries
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/login" className="[&.active]:font-bold ml-20">
          Login
        </Link>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
