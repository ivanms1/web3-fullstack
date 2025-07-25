import { Separator } from '@repo/ui/components/separator';
import { SidebarTrigger } from '@repo/ui/components/sidebar';

import { ModeToggle } from '@/components/mode-toggle/mode-toggle';
import { NetworkDisplay } from '@/components/network-display/network-display';
import { EventsSidebar } from '@/components/events-sidebar/events-sidebar';

export function SiteHeader() {
  return (
    <header className='sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        />
        <NetworkDisplay />
        <div className='ml-auto flex items-center gap-2'>
          <ModeToggle />
          <EventsSidebar />
        </div>
      </div>
    </header>
  );
}
