import PublicLayout from '@/components/layout/PublicLayout';
import type { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return <PublicLayout>{children}</PublicLayout>;
}
