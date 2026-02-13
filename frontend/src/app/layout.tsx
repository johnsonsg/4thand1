import '@payloadcms/next/css';
import '@/styles/payload-admin.css';
import type { ReactNode } from 'react';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import type { ServerFunctionClientArgs } from 'payload';
import configPromise from '@payload-config';
import { importMap } from './(payload)/admin/importMap';

export default async function RootAppLayout({ children }: { children: ReactNode }) {
  const serverFunction = async (args: ServerFunctionClientArgs) => {
    'use server';
    return handleServerFunctions({
      ...args,
      config: configPromise,
      importMap,
    });
  };

  return (
    <RootLayout
      config={configPromise}
      htmlProps={{
        className: 'dark',
        style: { colorScheme: 'dark' },
        suppressHydrationWarning: true,
      }}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}
