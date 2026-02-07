import '@payloadcms/next/css';
import type { ReactNode } from 'react';
import { RootLayout, metadata, handleServerFunctions } from '@payloadcms/next/layouts';
import type { ServerFunctionClientArgs } from 'payload';
import configPromise from '@payload-config';
import { importMap } from './admin/importMap';

export { metadata };

export default async function PayloadLayout({
  children,
}: {
  children: ReactNode;
}) {
  const serverFunction = async (args: ServerFunctionClientArgs) => {
    'use server';
    return handleServerFunctions({
      ...args,
      config: configPromise,
      importMap,
    });
  };

  return (
    <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
