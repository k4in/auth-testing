import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { type AuthState } from '../main';
import { useAuthStore } from '../lib/authStore';
import { useNavigate } from '@tanstack/react-router';

export default function LogoutButton() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios<AuthState>({
        method: 'post',
        data: { username: 'perfect_user' },
        url: 'http://localhost:3003/logout',
      });
      return response.data;
    },
    onError: (error) => console.log(error),
    onSuccess: () => {
      clearAuth();
      queryClient.removeQueries();
      // we could add a redirect search parameter here, if necessary. pass the location.href coming from useLocation
      navigate({ to: '/login' });
    },
  });

  return (
    <button
      type="button"
      className="ml-auto cursor-pointer bg-black text-white rounded-sm px-2 py-1 hover:bg-black/80 transition-colors disabled:bg-gray-700 disabled:text-gray-300 outline-none"
      disabled={isPending}
      onClick={() => mutate()}
    >
      Logout
    </button>
  );
}
