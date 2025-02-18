import { createFileRoute } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { delay } from '../lib/utils/delay';
import { countries } from '../mockData/countries';

const queryConfig = queryOptions({
  queryFn: async () => {
    await delay(1200);
    return countries;
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
      {countries.map((country, index) => (
        <div key={`${country}-${index}`}>{country}</div>
      ))}
    </div>
  );
}
