import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { type AuthState } from '../main';
import { useAuthStore } from '../lib/authStore';

export default function LogoutButton() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

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
    onSuccess: () => clearAuth(),
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
