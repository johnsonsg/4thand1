import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material/styles';

export function getTheme(mode: PaletteMode) {
  const common = {
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: 'var(--font-inter), sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'uppercase',
            fontFamily: 'var(--font-oswald), sans-serif',
            fontWeight: 600,
            letterSpacing: '0.08em',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: 'var(--font-oswald), sans-serif',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  } as const;

  if (mode === 'dark') {
    return createTheme({
      ...common,
      palette: {
        mode: 'dark',
        primary: {
          main: '#d4a017',
          contrastText: '#0d1117',
        },
        secondary: {
          main: '#232b38',
          contrastText: '#ede5d8',
        },
        background: {
          default: '#0d1117',
          paper: '#161c26',
        },
        text: {
          primary: '#ede5d8',
          secondary: '#6e7a8a',
        },
        divider: '#242d3a',
      },
    });
  }

  return createTheme({
    ...common,
    palette: {
      mode: 'light',
      primary: { main: '#d4a017' },
      secondary: { main: '#232b38' },
      background: {
        default: '#ffffff',
        paper: '#ffffff',
      },
      text: {
        primary: '#0f172a',
        secondary: '#475569',
      },
      divider: '#e2e8f0',
    },
  });
}
