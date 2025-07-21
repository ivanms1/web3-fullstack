'use client';

import { LogOut as LogOutIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <LogOutIcon className='w-5 h-5' />
            Logout Instructions
          </DialogTitle>
          <DialogDescription>
            To completely logout, you need to disconnect from MetaMask:
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-3'>
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium'>
                1
              </div>
              <p className='text-sm'>Open MetaMask extension</p>
            </div>
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium'>
                2
              </div>
              <p className='text-sm'>Click on this application icon</p>
            </div>
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium'>
                3
              </div>
              <p className='text-sm'>Click on the disconnect button</p>
            </div>
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium'>
                4
              </div>
              <p className='text-sm'>Done!</p>
            </div>
          </div>
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
