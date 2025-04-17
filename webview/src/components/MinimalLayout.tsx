import type { ReactNode } from 'react';
import '../index.css';

interface MinimalLayoutProps {
  children: ReactNode;
}

export default function MinimalLayout({ children }: MinimalLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
