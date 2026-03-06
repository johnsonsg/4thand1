"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default function TeamAdminOrgPicker() {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Select your team</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose an organization to load your team settings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrganizationSwitcher />
          <UserButton />
        </div>
      </div>
    </div>
  );
}
