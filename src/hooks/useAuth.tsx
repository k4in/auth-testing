import { useQuery } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import { redirect, useLocation } from '@tanstack/react-router';

export function useAuth() {
  const location = useLocation();

  const { data, isLoading, error, isError } = useQuery({
    queryFn: async () => {
      const response = await axios<{ is_authenticated: boolean; username?: string }>({
        method: 'get',
        url: 'http://localhost:3003/auth',
      });
      console.log(response);
      return response.data;
    },
    queryKey: ['userinfo'],
  });

  if (isError) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.log('redirecting to login'); // in a production app i would display a toast here or something similar, for a good user experience.
        throw redirect({ to: '/login', search: { redirect: location.href } });
      } else {
        console.log(error);
        throw new Error('Could not authenticate');
      }
    }
  }

  return { data, isLoading };
}
