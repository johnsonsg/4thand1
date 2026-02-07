import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import type { PaletteMode } from '@mui/material/styles';
import { getBrowserStorage } from '@/state/storage';

export const themeModeAtom = atomWithStorage<PaletteMode>(
  'site.themeMode',
  'dark',
  createJSONStorage<PaletteMode>(() => getBrowserStorage())
);

export const cartCountAtom = atomWithStorage<number>(
  'site.cartCount',
  0,
  createJSONStorage<number>(() => getBrowserStorage())
);

export const selectedParkAtom = atomWithStorage<string>(
  'site.selectedPark',
  'SeaWorld Orlando',
  createJSONStorage<string>(() => getBrowserStorage())
);

export const incrementCartAtom = atom(null, (get, set, by: number = 1) => {
  set(cartCountAtom, Math.max(0, get(cartCountAtom) + by));
});

export const clearCartAtom = atom(null, (_get, set) => {
  set(cartCountAtom, 0);
});
