import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import TeamAdminApp from '@/components/team-admin/TeamAdminApp';
import TeamAdminOrgPicker from '@/components/team-admin/TeamAdminOrgPicker';

export default function TeamAdminPage() {
  const { userId, orgId } = auth();

  if (!userId) {
    redirect('/team-admin/sign-in');
  }

  if (!orgId) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <TeamAdminOrgPicker />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <TeamAdminApp />
    </main>
  );
}
