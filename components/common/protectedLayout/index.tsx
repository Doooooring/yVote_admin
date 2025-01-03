import { ReactNode } from 'react';
import Header from '../header';
import Protected from '../protected';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <Protected>
      <Header />
      {children}
    </Protected>
  );
}
