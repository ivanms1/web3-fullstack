'use client';

import * as React from 'react';

import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components/sidebar';

import { NavMain } from '@/components/sidebar/nav-main';
import { NavSecondary } from '@/components/sidebar/nav-secondary';
import { NavUser } from '@/components/sidebar/nav-user';
import {
  ChartBar,
  Folder,
  HelpCircle,
  LayoutDashboard,
  List,
  Users,
} from 'lucide-react';

const NAV_ITEMS = {
  navMain: [
    {
      title: 'My Wallet',
      url: '/my-wallet',
      icon: List,
    },
    {
      title: 'Transactions',
      url: '/transactions',
      icon: ChartBar,
    },
    {
      title: 'Approvals',
      url: '/approvals',
      icon: Folder,
    },
    {
      title: 'User Lookup',
      url: '/users',
      icon: Users,
    },
  ],
  navSecondary: [
    {
      title: 'Get Help',
      url: '/help',
      icon: HelpCircle,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <Link href='/'>
                <LayoutDashboard className='!size-5' />
                <span className='text-base font-semibold'>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_ITEMS.navMain} />
        <NavSecondary items={NAV_ITEMS.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
