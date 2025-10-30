'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PhoneNumberModalProps {
  isOpen: boolean;
  onSave: (phone: string) => Promise<void>;
  initialPhone?: string;
  title?: string;
}

export function PhoneNumberModal({
  isOpen,
  onSave,
  initialPhone = '',
  title = 'Update Phone Number',
}: PhoneNumberModalProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhone(initialPhone);
    }
  }, [isOpen, initialPhone]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(phone);
      toast.success('Phone number updated successfully');
    } catch (error: any) {
      toast.error('Failed to update phone number: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {}}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
    >
      <DialogContent className="sm:max-w-md w-full mx-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Phone Number</label>
            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              autoFocus
            />
          </div>
          <DialogFooter className="flex justify-end">
            <Button type="button" onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
