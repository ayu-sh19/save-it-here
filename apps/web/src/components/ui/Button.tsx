import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    
    const variants = {
      primary: 'bg-crimson text-white border-2 border-ink shadow-brutal-md hover:-translate-y-1 hover:translate-x-1 hover:shadow-brutal-sm',
      secondary: 'bg-paper text-ink border-2 border-ink shadow-brutal-md hover:-translate-y-1 hover:translate-x-1 hover:shadow-brutal-sm',
      danger: 'bg-red-600 text-white border-2 border-ink shadow-brutal-md hover:-translate-y-1 hover:translate-x-1 hover:shadow-brutal-sm',
      ghost: 'bg-transparent text-ink hover:bg-ink/5',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-display font-bold uppercase transition-transform active:translate-y-0 active:translate-x-0 active:shadow-none focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
