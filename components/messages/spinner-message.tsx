import React from 'react';
import { IconSpinner } from '@/components/ui/icons';

export function SpinnerMessage() {
  return (
    <div className="flex items-center justify-center p-4">
      <IconSpinner className="h-6 w-6 animate-spin" />
    </div>
  );
}