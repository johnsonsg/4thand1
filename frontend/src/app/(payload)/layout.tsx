import type { ReactNode } from 'react';
import { metadata } from '@payloadcms/next/layouts';

export { metadata };

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return children;
}
