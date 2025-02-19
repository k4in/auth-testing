import { createFileRoute } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

const queryConfig = queryOptions({
  queryFn: async () => {
    const response = await axios<string[]>({ method: 'get', url: 'http://localhost:3003/countries' });

    return response.data;
  },
  queryKey: ['contries'],
});

export const Route = createFileRoute('/countries')({
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
      {countries.sort().map((country, index) => (
        <div key={`${country}-${index}`}>{country}</div>
      ))}
    </div>
  );
}
