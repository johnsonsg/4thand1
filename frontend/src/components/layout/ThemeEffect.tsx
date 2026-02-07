import * as React from 'react';
import { useAtomValue } from 'jotai';
import { themeModeAtom } from '@/state/atoms';

export default function ThemeEffect() {
  const mode = useAtomValue(themeModeAtom);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    root.style.colorScheme = mode;
  }, [mode]);

  return null;
}
