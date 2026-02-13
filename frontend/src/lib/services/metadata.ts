import { headers } from 'next/headers';

import { fetchLayoutData } from '@/lib/services/layout';
import type { CmsLayoutData } from '@/lib/types/cms';

export type SiteMetadata = {
  teamName: string;
  mascot: string;
  sport: string;
  teamLabel: string;
  titleSuffix: string;
};

const DEFAULT_METADATA: SiteMetadata = {
  teamName: 'Westfield',
  mascot: 'Eagles',
  sport: 'Football',
  teamLabel: 'Westfield Eagles',
  titleSuffix: 'Westfield Eagles Football',
};

const buildSiteMetadata = (raw?: Partial<SiteMetadata>): SiteMetadata => {
  const teamName = raw?.teamName ?? DEFAULT_METADATA.teamName;
  const mascot = raw?.mascot ?? DEFAULT_METADATA.mascot;
  const sport = raw?.sport ?? DEFAULT_METADATA.sport;
  const teamLabel = [teamName, mascot].filter(Boolean).join(' ').trim();
  const titleSuffix = [teamName, mascot, sport].filter(Boolean).join(' ').trim();

  return {
    teamName,
    mascot,
    sport,
    teamLabel: teamLabel || DEFAULT_METADATA.teamLabel,
    titleSuffix: titleSuffix || DEFAULT_METADATA.titleSuffix,
  };
};

export async function getSiteMetadata(path: string): Promise<SiteMetadata> {
  const reqHeaders = await headers();
  const layoutData = (await fetchLayoutData({ path, headers: reqHeaders })) as CmsLayoutData;
  const context = (layoutData?.cms?.context ?? {}) as Record<string, unknown>;
  const metadata = (context.metadata ?? {}) as Partial<SiteMetadata>;

  return buildSiteMetadata(metadata);
}
