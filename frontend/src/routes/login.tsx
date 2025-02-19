import { createFileRoute, useLocation, useRouter, redirect } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import { FormEvent, useState } from 'react';
import { delay } from '../lib/utils/delay';
import { useAuthStore } from '../lib/authStore';
import { type AuthState } from '../main';

type LoginSearch = {
  redirect?: string;
};

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context, search }) => {
    try {
      const response = await axios<AuthState>({
        method: 'get',
        url: 'http://localhost:3003/auth',
      });
      context.setAuth(response.data);
      if (response.data.is_authenticated) {
        return redirect({ to: search.redirect || '/', replace: true });
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
      } else {
        console.log(error);
        throw new Error('Unknown authentification error');
      }
    }
  },
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: search.redirect as string,
    };
  },
  component: Login,
});

export function Login() {
  const [value, setValue] = useState<string>('perfect_user');
  const setAuth = useAuthStore((state) => state.setAuth);
  const location = useLocation();
  const router = useRouter();
  // const isAuthenticated = useAuthStore((state) => state.auth.is_authenticated);
  const queryClient = useQueryClient();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.history.push(location.search.redirect || '/');
  //   }
  // }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await delay(700);
      const response = await axios({
        method: 'post',
        url: 'http://localhost:3003/auth',
        data: { username: value },
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data);
      queryClient.invalidateQueries();
      router.history.push(location.search.redirect || '/');
    },
    onError: (error) => console.log(error.message),
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate();
  }

  return (
    <div className="p-2 h-full w-full flex justify-center mt-20">
      <form onSubmit={handleSubmit} className="shadow bg-gray-200 rounded p-10">
        <div className="flex flex-col space-y-1">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            required
            id="username"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            placeholder={'enter name'}
            disabled={isPending}
            className="p-1 border border-black focus:border-emerald-500 outline-none transition-all rounded w-[200px] disabled:bg-gray-200 disabled:text-gray-700 bg-white focus:ring-2 ring-emerald-500"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-black hover:bg-black/75 transition colors text-white px-4 py-2 mt-6 cursor-pointer rounded disabled:cursor-not-allowed disabled:bg-gray-700"
        >
          login
        </button>
      </form>
    </div>
  );
}
