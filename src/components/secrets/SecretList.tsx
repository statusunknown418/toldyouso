"use client";
import { CompleteSecret } from "@/lib/db/schema/secrets";
import { trpc } from "@/lib/trpc/client";
import SecretModal from "./SecretModal";

export default function SecretList({ secrets }: { secrets: CompleteSecret[] }) {
  const { data: s } = trpc.secrets.getSecrets.useQuery(undefined, {
    initialData: { secrets },
    refetchOnMount: false,
  });

  if (s.secrets.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {s.secrets.map((secret) => (
        <Secret secret={secret} key={secret.id} />
      ))}
    </ul>
  );
}

const Secret = ({ secret }: { secret: CompleteSecret }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{secret.title}</div>
      </div>
      <SecretModal secret={secret} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No secrets</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new secret.
      </p>
      <div className="mt-6">
        <SecretModal emptyState={true} />
      </div>
    </div>
  );
};
