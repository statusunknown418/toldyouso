import SecretList from "@/components/secrets/SecretList";
import NewSecretModal from "@/components/secrets/SecretModal";
import { getSecrets } from "@/lib/api/secrets/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function Secrets() {
  await checkAuth();
  const { secrets } = await getSecrets();

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Secrets</h1>
        <NewSecretModal />
      </div>
      <SecretList secrets={secrets} />
    </main>
  );
}
