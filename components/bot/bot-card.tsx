import React from 'react';

interface BotCardProps {
  children: React.ReactNode;
}

export function BotCard({ children }: BotCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      {children}
    </div>
  );
}