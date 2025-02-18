import axios, { isAxiosError } from 'axios';
import { redirect } from '@tanstack/react-router';

export async function getAuthInfo(location: string) {
  try {
    const response = await axios({
      method: 'get',
      url: 'http://localhost:3003/auth?is_authed=no',
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.log('redirecting to login'); // in a production app i would display a toast here or something similar, for a good user experience.
        throw redirect({ to: '/login', search: { redirect: location } });
      } else {
        console.log(error);
        throw new Error('Could not authenticate');
      }
    } else {
      throw new Error('Unknown error');
    }
  }
}
