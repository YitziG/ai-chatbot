import React from 'react';

const placeholderAnalytics = [
  {
    title: 'Loading...',
    description: 'Please wait while we fetch the data.'
  },
  {
    title: 'Loading...',
    description: 'Please wait while we fetch the data.'
  },
  {
    title: 'Loading...',
    description: 'Please wait while we fetch the data.'
  }
];

export const AnalyticsSkeleton = () => {
  return (
    <div className="-mt-2 flex w-full flex-col gap-2 py-4">
      {placeholderAnalytics.map((item, index) => (
        <div
          key={index}
          className="flex shrink-0 flex-col gap-1 rounded-lg bg-zinc-800 p-4"
        >
          <div className="w-fit rounded-md bg-zinc-700 text-sm text-transparent">
            {item.title}
          </div>
          <div className="w-auto rounded-md bg-zinc-700 text-transparent">
            {item.description}
          </div>
        </div>
      ))}
    </div>
  );
};