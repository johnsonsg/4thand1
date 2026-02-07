import type { Metadata } from 'next';
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import configPromise from '@payload-config';
import { importMap } from '../importMap';

type PageProps = {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ params, searchParams }: PageProps) {
  return RootPage({
    config: configPromise,
    importMap,
    params,
    searchParams,
  });
}

export const generateMetadata = (props: {
  params: Promise<{ segments?: string[] }>;
}): Promise<Metadata> => {
  return generatePageMetadata({
    config: configPromise,
    params: props.params,
  });
};
