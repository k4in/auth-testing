import { createFileRoute } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { delay } from '../lib/utils/delay';
import { countries } from '../mockData/countries';
import axios, { isAxiosError } from 'axios';
import { redirect } from '@tanstack/react-router';

const queryConfig = queryOptions({
  queryFn: async () => {
    await delay(1200);
    return countries;
  },
  queryKey: ['contries'],
});

async function handleBeforeLoad(location: string) {
  try {
    const response = await axios({
      method: 'get',
      url: 'http://localhost:3003/auth?username=perfect_usr',
      // withCredentials: true,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.log('redirecting...');
        throw redirect({ to: '/about', search: { redirect: location } });
      } else {
        console.log(error);
        throw new Error('Could not authenticate');
      }
    } else {
      throw new Error('Unknown error');
    }
  }
}

export const Route = createFileRoute('/countries')({
  beforeLoad: async ({ location }) => {
    await handleBeforeLoad(location.href);
  },
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(queryConfig);
  },
  component: RouteComponent,
  pendingComponent: PendingComponent,
});

function PendingComponent() {
  return <div>Pending...</div>;
}

function RouteComponent() {
  const { data: countries } = useSuspenseQuery(queryConfig);
  return (
    <div className="p-2">
      {countries.map((country, index) => (
        <div key={`${country}-${index}`}>{country}</div>
      ))}
    </div>
  );
}
