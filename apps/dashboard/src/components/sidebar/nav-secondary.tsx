'use client';
import { useEffect, useState } from 'react';

import { useTheme } from 'next-themes';
import { SunMoon, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components/sidebar';
import { Skeleton } from '@repo/ui/components/skeleton';
import { Switch } from '@repo/ui/components/switch';

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem className='group-data-[collapsible=icon]:hidden'>
            <SidebarMenuButton asChild>
              <label>
                <SunMoon />
                <span>Dark Mode</span>
                {mounted ? (
                  <Switch
                    className='ml-auto'
                    checked={resolvedTheme !== 'light'}
                    onCheckedChange={() =>
                      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                    }
                  />
                ) : (
                  <Skeleton className='ml-auto h-4 w-8 rounded-full' />
                )}
              </label>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
