import React from 'react';

interface UserMessageProps {
  children: React.ReactNode;
}

export function UserMessage({ children }: UserMessageProps) {
  return (
    <div className="flex items-start gap-4 pt-4">
      <div className="rounded-full bg-primary p-2 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden px-1">
        {children}
      </div>
    </div>
  );
}