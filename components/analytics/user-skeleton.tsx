import React from 'react';

const placeholderUsers = [
  {
    first_name: 'Loading...',
    last_name: '',
    place_of_work: 'Please wait while we fetch the data.',
    title: { name: 'Loading...' },
    area_practice: { name: 'Loading...' },
    email: 'Loading...',
    avatar: 'https://api.hospitalpedia.com/images/default-avatar.jpg',
  },
  // Add more placeholder users if needed
];

export const UserSkeleton = () => {
  return (
    <div className="-mt-2 flex w-full flex-col gap-2 py-4">
      {placeholderUsers.map((user, index) => (
        <div
          key={index}
          className="flex shrink-0 flex-col gap-1 rounded-lg bg-zinc-800 p-4"
        >
          <div className="w-fit rounded-md bg-zinc-700 text-sm text-transparent">
            {user.first_name} {user.last_name}
          </div>
          <div className="w-auto rounded-md bg-zinc-700 text-transparent">
            {user.place_of_work}
          </div>
        </div>
      ))}
    </div>
  );
};