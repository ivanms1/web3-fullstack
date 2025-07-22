'use client';

import * as React from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@repo/ui/lib/utils';
import { Button } from '@repo/ui/components/button';

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  onCopy?: () => void;
}

function CopyButton({
  text,
  className,
  variant = 'outline',
  size = 'sm',
  children,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
      toast.success('Copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn('gap-2', className)}
      type='button'
    >
      {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
      {children || text}
    </Button>
  );
}

export { CopyButton };
