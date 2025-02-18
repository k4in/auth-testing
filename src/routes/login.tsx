import { createFileRoute, useRouter, useLocation } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { FormEvent, useState } from 'react';
import { delay } from '../lib/utils/delay';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

//TODO!! Login form should not be accessable when user is logged in.
//TODO!! Login form shouldn't be part of the root layout. We'll have to render a middleware component.

function RouteComponent() {
  const [value, setValue] = useState<string>('perfect_user');
  const { search } = useLocation();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await delay(500);
      const response = await axios({
        method: 'post',
        url: 'http://localhost:3003/auth',
        data: { username: value },
      });
      return response.data;
    },
    onSuccess: () => router.history.push(search.redirect || '/'),
    onError: (error) => console.log(error.message),
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate();
  }

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-1">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            placeholder={'enter name'}
            disabled={isPending}
            className="p-1 border border-black focus:border-emerald-500 outline-none transition-colors rounded w-[200]px disabled:bg-gray-200 disabled:text-gray-700"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-black hover:bg-black/75 transition colors shadow text-white px-4 py-2 mt-3 cursor-pointer rounded disabled:cursor-not-allowed disabled:bg-gray-700"
        >
          login
        </button>
      </form>
    </div>
  );
}
