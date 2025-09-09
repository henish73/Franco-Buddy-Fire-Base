import PublicLayout from '@/components/layout/PublicLayout';
import type { PropsWithChildren } from 'react';

// This file can be removed if all pages use a specific layout, but it's a good default.
export default function Layout({ children }: PropsWithChildren) {
  return <PublicLayout>{children}</PublicLayout>;
}