'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface TransitionLinkProps {
  href: string;
  transition?: 'overlay' | 'slide' | 'scale' | 'wipe';
  children: ReactNode;
  className?: string;
}

export default function TransitionLink({ href, transition = 'overlay', children, className = '' }: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Store transition type
    sessionStorage.setItem('pageTransition', transition);
    
    // Navigate after small delay
    setTimeout(() => {
      router.push(href);
    }, 50);
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
