import * as React from 'react';
import type { GetServerSideProps } from 'next';
import type { CmsLayoutData } from '@/lib/types/cms';
import Placeholder from '@/lib/utils/Placeholder';
import { fetchLayoutData } from '@/lib/services/layout';
import { ThemeTokensEffect } from '@/lib/theme/ThemeTokensEffect';
import type { ThemeConfig } from "@/lib/theme/types";


type PageProps = {
  layoutData: CmsLayoutData;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const segments = (context.params?.path as string[] | undefined) ?? [];
  const path = `/${segments.join('/')}`.replace(/\/$/, '') || '/';

  const layoutData = await fetchLayoutData({ path, context });

  if (!layoutData?.cms?.route) {
    return { notFound: true };
  }

  return { props: { layoutData } };
};

export default function RoutePage({ layoutData }: PageProps) {
  const route = layoutData.cms.route;
  const theme = (layoutData.cms.context?.theme ?? null) as ThemeConfig | null;

  if (!route) return null;

  return (
    <main>
      <ThemeTokensEffect theme={theme} />
      <Placeholder name="main" rendering={route} />
    </main>
  );
}
