import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex w-full border-2 border-ink bg-white py-3 font-sans shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-ink disabled:cursor-not-allowed disabled:opacity-50',
            icon ? 'pl-11 pr-4' : 'px-4',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
