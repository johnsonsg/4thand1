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
          containedPrimary: {
            '&:hover': {
              backgroundColor: 'hsl(var(--primary))',
              filter: 'brightness(0.9)',
            },
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
      MuiInputBase: {
        styleOverrides: {
          input: {
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '0.875rem',
            lineHeight: 1.25,
            padding: '8px 12px',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'hsl(var(--border))',
            },
            '& .MuiInputBase-input': {
              color: 'hsl(var(--foreground))',
            },
            '& .MuiSvgIcon-root': {
              color: 'hsl(var(--muted-foreground))',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'hsl(var(--primary))',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'hsl(var(--primary))',
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: 'hsl(var(--muted-foreground))',
            '&.Mui-focused': {
              color: 'hsl(var(--primary))',
            },
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
          main: 'hsl(var(--primary))',
          contrastText: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          main: 'hsl(var(--secondary))',
          contrastText: 'hsl(var(--secondary-foreground))',
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
      primary: {
        main: 'hsl(var(--primary))',
        contrastText: 'hsl(var(--primary-foreground))',
      },
      secondary: {
        main: 'hsl(var(--secondary))',
        contrastText: 'hsl(var(--secondary-foreground))',
      },
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
