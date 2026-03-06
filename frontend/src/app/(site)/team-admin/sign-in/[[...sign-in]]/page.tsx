import { SignIn } from '@clerk/nextjs';

export default function TeamAdminSignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <SignIn routing="path" path="/team-admin/sign-in" />
    </main>
  );
}
