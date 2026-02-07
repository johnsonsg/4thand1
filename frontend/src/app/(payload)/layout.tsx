import '@payloadcms/next/css';
import type { ReactNode } from 'react';
import { RootLayout, metadata, handleServerFunctions } from '@payloadcms/next/layouts';
import configPromise from '@payload-config';

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
    <RootLayout config={configPromise} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
