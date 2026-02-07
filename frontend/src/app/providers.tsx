'use client';

import * as React from 'react';
import type { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { useAtomValue } from 'jotai';
import { Inter, Oswald } from 'next/font/google';

import createEmotionCache from '@/createEmotionCache';
import { getTheme } from '@/theme';
import { themeModeAtom } from '@/state/atoms';
import ThemeEffect from '@/components/layout/ThemeEffect';
import { ClerkControls } from '@/components/auth/ClerkControls';

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const clientSideEmotionCache = createEmotionCache();

type ProvidersProps = {
  children: React.ReactNode;
  emotionCache?: EmotionCache;
};

export function Providers({ children, emotionCache = clientSideEmotionCache }: ProvidersProps) {
  const mode = useAtomValue(themeModeAtom);
  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <CacheProvider value={emotionCache}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <ThemeEffect />
          <ClerkControls />
          <div className={`${oswald.variable} ${inter.variable}`}>{children}</div>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
}
