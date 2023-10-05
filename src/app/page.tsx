import SecretModal from "@/components/secrets/SecretModal";
import { getUserAuth } from "@/lib/auth/utils";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function Home() {
  const userAuth = await getUserAuth();

  return (
    <main className="">
      <UserButton afterSignOutUrl="/" />
      <pre>{JSON.stringify(userAuth, null, 2)}</pre>
      <h1>Welcome</h1>

      <Link href="/sign-in">
        <span>Sign in</span>
      </Link>

      <SecretModal />
    </main>
  );
}
