import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import type { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import createEmotionCache from '@/createEmotionCache';
import * as React from 'react';
import { useAtomValue } from 'jotai';
import { getTheme } from '@/theme';
import { themeModeAtom } from '@/state/atoms';
import ThemeEffect from '@/components/layout/ThemeEffect';
import { Inter, Oswald } from 'next/font/google';

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const clientSideEmotionCache = createEmotionCache();

type MyAppProps = AppProps & {
  emotionCache?: EmotionCache;
};

export default function App({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) {
  const mode = useAtomValue(themeModeAtom);
  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <CacheProvider value={emotionCache}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <ThemeEffect />
          <div className={`${oswald.variable} ${inter.variable}`}>
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
}
