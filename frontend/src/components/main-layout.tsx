import { Link } from '@tanstack/react-router';
import LogoutButton from './logout-button';
import { Outlet } from '@tanstack/react-router';
import { useAuthStore } from '../lib/authStore';

export function MainLayout() {
  const isAuthenticated = useAuthStore((state) => state.auth.is_authenticated);

  return (
    <>
      <header className="p-2 flex gap-2 border-b items-center">
        {isAuthenticated ? (
          <>
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>
            <Link to="/countries" className="[&.active]:font-bold">
              Countries
            </Link>
            <Link to="/about" className="[&.active]:font-bold">
              About
            </Link>
            <LogoutButton />
            <Link to="/login" className="[&.active]:font-bold">
              Login
            </Link>
          </>
        ) : (
          <Link to="/login" className="[&.active]:font-bold ml-auto">
            Login
          </Link>
        )}
      </header>
      <Outlet />
    </>
  );
}
