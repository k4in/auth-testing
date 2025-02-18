import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { type RouterContext } from '../main';

export const Route = createRootRouteWithContext<RouterContext>()({
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
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
