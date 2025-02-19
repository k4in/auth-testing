import { createFileRoute } from '@tanstack/react-router';
import { useAuthStore } from '../lib/authStore';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const isAuthenticated = useAuthStore((state) => state.auth.is_authenticated);

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      {isAuthenticated && <div className="text-sm text-emerald-500">user is logged in!</div>}
    </div>
  );
}
