import { Link } from '@tanstack/react-router';
import LogoutButton from './logout-button';
import { Outlet } from '@tanstack/react-router';

export function MainLayout() {
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
        <LogoutButton />
      </header>
      <Outlet />
    </>
  );
}
