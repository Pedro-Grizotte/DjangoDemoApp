import type { ReactNode } from 'react';

export default function ConteudoPagina({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <main className={`page-container ${className}`}>{children}</main>;
}
