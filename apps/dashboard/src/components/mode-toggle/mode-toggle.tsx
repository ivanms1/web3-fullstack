'use client';

import * as React from 'react';
import { SunMoon } from 'lucide-react';

import { useTheme } from 'next-themes';

import { Button } from '@repo/ui/components/button';

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      variant='secondary'
      size='icon'
      className='group/toggle size-8'
      onClick={toggleTheme}
    >
      <SunMoon />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
