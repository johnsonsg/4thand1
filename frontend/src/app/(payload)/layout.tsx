import '@payloadcms/next/css';
import type { ReactNode } from 'react';
import { RootLayout, metadata, handleServerFunctions } from '@payloadcms/next/layouts';
import configPromise from '@payload-config';
import { importMap } from './admin/importMap';

export { metadata };

export default async function PayloadLayout({
  children,
}: {
  children: ReactNode;
}) {
  const serverFunction = async (args: Parameters<typeof handleServerFunctions>[0]) => {
    'use server';
    return handleServerFunctions(args);
  };

  return (
    <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
