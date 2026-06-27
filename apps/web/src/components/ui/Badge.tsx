import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'crimson' | 'gold' | 'ink';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-white text-ink',
    crimson: 'bg-crimson text-white',
    gold: 'bg-gold text-ink',
    ink: 'bg-ink text-white',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center border-2 border-ink px-2.5 py-0.5 text-xs font-mono font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 uppercase',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
